InstallDir "PC-Miner\"

Function .onVerifyInstDir
    !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"
FunctionEnd

!macro preInit
  ; This macro is inserted at the beginning of the NSIS .OnInit callback
  ; !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"
  SetRegView 64
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\PC-Miner"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\PC-Miner"
  SetRegView 32
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\PC-Miner"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\PC-Miner"
!macroend