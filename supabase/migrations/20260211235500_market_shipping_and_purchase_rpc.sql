-- Market shipping support + atomic purchase RPC

ALTER TABLE public.market_items
ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.user_purchases
ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS shipping_status TEXT NOT NULL DEFAULT 'not_required' CHECK (
  shipping_status IN ('not_required', 'address_collected', 'processing', 'shipped', 'delivered')
);

DROP FUNCTION IF EXISTS public.purchase_market_item(UUID, INTEGER, JSONB);

CREATE OR REPLACE FUNCTION public.purchase_market_item(
  p_item_id UUID,
  p_quantity INTEGER DEFAULT 1,
  p_shipping_address JSONB DEFAULT NULL
)
RETURNS public.user_purchases
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purchase public.user_purchases%ROWTYPE;
  v_item public.market_items%ROWTYPE;
  v_total_price BIGINT;
  v_updated_credits BIGINT;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than zero';
  END IF;

  SELECT *
  INTO v_item
  FROM public.market_items
  WHERE id = p_item_id
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Market item not found';
  END IF;

  IF COALESCE(v_item.is_active, false) = false THEN
    RAISE EXCEPTION 'Item is not available for purchase';
  END IF;

  IF v_item.requires_shipping THEN
    IF p_shipping_address IS NULL THEN
      RAISE EXCEPTION 'Shipping address is required for this item';
    END IF;

    IF COALESCE(TRIM(p_shipping_address->>'recipientName'), '') = ''
      OR COALESCE(TRIM(p_shipping_address->>'phone'), '') = ''
      OR COALESCE(TRIM(p_shipping_address->>'city'), '') = ''
      OR COALESCE(TRIM(p_shipping_address->>'district'), '') = ''
      OR COALESCE(TRIM(p_shipping_address->>'postalCode'), '') = ''
      OR COALESCE(TRIM(p_shipping_address->>'addressLine'), '') = '' THEN
      RAISE EXCEPTION 'Shipping address is incomplete';
    END IF;

    IF COALESCE(p_shipping_address->>'country', '') <> 'TR' THEN
      RAISE EXCEPTION 'Unsupported shipping country';
    END IF;
  END IF;

  IF v_item.stock IS NOT NULL THEN
    UPDATE public.market_items
    SET stock = stock - p_quantity
    WHERE id = v_item.id
      AND stock >= p_quantity;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient stock';
    END IF;
  END IF;

  v_total_price := v_item.price * p_quantity;

  UPDATE public.profiles
  SET credits = credits - v_total_price
  WHERE id = v_user_id
    AND COALESCE(credits, 0) >= v_total_price
  RETURNING credits INTO v_updated_credits;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  INSERT INTO public.user_purchases (
    user_id,
    item_id,
    quantity,
    total_price,
    status,
    purchased_at,
    requires_shipping,
    shipping_address,
    shipping_status
  )
  VALUES (
    v_user_id,
    v_item.id,
    p_quantity,
    v_total_price,
    'completed',
    NOW(),
    v_item.requires_shipping,
    CASE WHEN v_item.requires_shipping THEN p_shipping_address ELSE NULL END,
    CASE WHEN v_item.requires_shipping THEN 'address_collected' ELSE 'not_required' END
  )
  RETURNING * INTO v_purchase;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'credit_transactions'
  ) THEN
    INSERT INTO public.credit_transactions (
      user_id,
      transaction_type,
      amount,
      description
    )
    VALUES (
      v_user_id,
      'decrease',
      v_total_price,
      'Market satin alimi'
    );
  END IF;

  RETURN v_purchase;
END;
$$;

REVOKE ALL ON FUNCTION public.purchase_market_item(UUID, INTEGER, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purchase_market_item(UUID, INTEGER, JSONB) TO authenticated;
