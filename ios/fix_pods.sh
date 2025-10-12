#!/bin/bash
set -e

# Log dosyası
LOGFILE="pod_fix_log.txt"

# 1. CocoaPods ve Ruby ortamını güncelle
function update_cocoapods() {
  echo "[1/9] CocoaPods ve Ruby ortamı güncelleniyor..." | tee -a $LOGFILE
  sudo gem install cocoapods --no-document | tee -a $LOGFILE
  pod repo update | tee -a $LOGFILE
}

# 2. Pod cache ve DerivedData temizliği
function clean_cache() {
  echo "[2/9] Pod cache ve DerivedData temizleniyor..." | tee -a $LOGFILE
  pod cache clean --all | tee -a $LOGFILE
  rm -rf ~/Library/Developer/Xcode/DerivedData/*
}

# 3. Podfile.lock, Pods ve .xcworkspace sil
function clean_pods() {
  echo "[3/9] Podfile.lock, Pods ve .xcworkspace siliniyor..." | tee -a $LOGFILE
  rm -rf Podfile.lock Pods *.xcworkspace
}

# 4. node_modules ve package-lock.json sil
function clean_node_modules() {
  echo "[4/9] node_modules ve package-lock.json siliniyor..." | tee -a $LOGFILE
  cd ..
  rm -rf node_modules package-lock.json bun.lock yarn.lock
  cd ios
}

# 5. npm install
function npm_install() {
  echo "[5/9] npm install çalıştırılıyor..." | tee -a $LOGFILE
  cd ..
  npm install | tee -a ios/$LOGFILE
  cd ios
}

# 6. react_native_pods.rb dosyası kontrol
function check_react_native_pods() {
  echo "[6/9] react_native_pods.rb dosyası kontrol ediliyor..." | tee -a $LOGFILE
  if [ ! -f ../node_modules/react-native/scripts/react_native_pods.rb ]; then
    echo "react_native_pods.rb bulunamadı! npm install başarısız veya react-native eksik." | tee -a $LOGFILE
    exit 1
  fi
}

function clean_cocoapods_cache() {
  echo "[7/9] CocoaPods cache tamamen temizleniyor..." | tee -a $LOGFILE
  pod cache clean --all | tee -a $LOGFILE
  rm -rf "$HOME/Library/Caches/CocoaPods" "$HOME/Library/Developer/Xcode/DerivedData" "$HOME/Library/Caches/com.apple.dt.Xcode"
}

# 7. Pod install
function pod_install_verbose() {
  echo "[8/9] Pod install (verbose) çalıştırılıyor..." | tee -a $LOGFILE
  pod install --verbose | tee -a $LOGFILE
}

# 8. Sonuç
function finish() {
  echo "[9/9] İşlem tamamlandı. Eğer hata aldıysan $LOGFILE dosyasını incele." | tee -a $LOGFILE
}

# 6. Ana akış
update_cocoapods
clean_cache
clean_pods
clean_node_modules
npm_install
check_react_native_pods
clean_cocoapods_cache
pod_install_verbose
finish

echo "Tüm işlemler başarıyla tamamlandı!" 