SHELL := cmd.exe
CYGWIN=nontsec
export PATH := C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\Program Files\MATLAB\R2026a\bin;C:\Program Files\NVIDIA Corporation\NVIDIA App\NvDLISR;C:\Program Files (x86)\NVIDIA Corporation\PhysX\Common;C:\Program Files\dotnet\;C:\Users\marko\AppData\Local\Microsoft\WindowsApps;C:\Program Files (x86)\Common Files\Hilscher GmbH\TLRDecode;C:\Users\marko\AppData\Local\Microsoft\WindowsApps;C:\Program Files (x86)\Common Files\Hilscher GmbH\TLRDecode;C:\Program Files (x86)\BRAutomation\AS6\bin-en
export AS_BUILD_MODE := BuildAndTransfer
export AS_VERSION := 6.7.0.187
export AS_WORKINGVERSION := 6.7
export AS_COMPANY_NAME :=  
export AS_USER_NAME := marko
export AS_PATH := C:/Program Files (x86)/BRAutomation/AS6
export AS_BIN_PATH := C:/Program Files (x86)/BRAutomation/AS6/bin-en
export AS_PROJECT_PATH := C:/Users/marko/Documents/mieszadlo/Zbiorniki_AS6
export AS_PROJECT_NAME := CaseWeek_user
export AS_SYSTEM_PATH := C:/Program\ Files\ (x86)/BRAutomation/AS6/AS/System
export AS_VC_PATH := C:/Program\ Files\ (x86)/BRAutomation/AS6/AS/VC
export AS_TEMP_PATH := C:/Users/marko/Documents/mieszadlo/Zbiorniki_AS6/Temp
export AS_CONFIGURATION := X20CP1684
export AS_BINARIES_PATH := C:/Users/marko/Documents/mieszadlo/Zbiorniki_AS6/Binaries
export AS_GNU_INST_PATH := C:/Program\ Files\ \(x86\)/BRAutomation/AS6/AS/GnuInst/V11.3.0
export AS_GNU_BIN_PATH := C:/Program\ Files\ \(x86\)/BRAutomation/AS6/AS/GnuInst/V11.3.0/6.3/bin
export AS_GNU_INST_PATH_SUB_MAKE := C:/Program Files (x86)/BRAutomation/AS6/AS/GnuInst/V11.3.0
export AS_GNU_BIN_PATH_SUB_MAKE := C:/Program Files (x86)/BRAutomation/AS6/AS/GnuInst/V11.3.0/6.3/bin
export AS_INSTALL_PATH := C:/Program\ Files\ \(x86\)/BRAutomation/AS6
export WIN32_AS_PATH := "C:\Program Files (x86)\BRAutomation\AS6"
export WIN32_AS_BIN_PATH := "C:\Program Files (x86)\BRAutomation\AS6\bin-en"
export WIN32_AS_PROJECT_PATH := "C:\Users\marko\Documents\mieszadlo\Zbiorniki_AS6"
export WIN32_AS_SYSTEM_PATH := "C:\Program Files (x86)\BRAutomation\AS6\AS\System"
export WIN32_AS_VC_PATH := "C:\Program Files (x86)\BRAutomation\AS6\AS\VC"
export WIN32_AS_TEMP_PATH := "C:\Users\marko\Documents\mieszadlo\Zbiorniki_AS6\Temp"
export WIN32_AS_BINARIES_PATH := "C:\Users\marko\Documents\mieszadlo\Zbiorniki_AS6\Binaries"
export WIN32_AS_GNU_INST_PATH := "C:\Program Files (x86)\BRAutomation\AS6\AS\GnuInst\V11.3.0"
export WIN32_AS_GNU_BIN_PATH := "C:\Program Files (x86)\BRAutomation\AS6\AS\GnuInst\V11.3.0\bin"
export WIN32_AS_INSTALL_PATH := "C:\Program Files (x86)\BRAutomation\AS6"

.suffixes:

ProjectMakeFile:

	@'$(AS_BIN_PATH)/BR.AS.AnalyseProject.exe' '$(AS_PROJECT_PATH)/CaseWeek_user.apj' -t '$(AS_TEMP_PATH)' -c '$(AS_CONFIGURATION)' -o '$(AS_BINARIES_PATH)'   -sfas -buildMode 'BuildAndTransfer'   

