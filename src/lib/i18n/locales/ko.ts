
export default {
  metadata: {
    title: "ScanPro - 무료 PDF 변환 및 편집 온라인",
    template: "%s | ScanPro - PDF 도구",
    description: "ScanPro로 PDF를 쉽게 변환, 편집, 압축, 병합, 분할, OCR. 무료, 빠른 온라인 도구—다운로드 불필요.",
    keywords: "PDF 변환, PDF 편집, 온라인 OCR, PDF 압축, PDF 병합, PDF 분할, 무료 PDF 도구, 온라인 PDF 편집, ScanPro"
  },
  nav: {
    tools: "도구",
    company: "회사",
    pricing: "가격",
    convertPdf: "PDF 변환",
    convertPdfDesc: "PDF를 다른 형식으로 또는 다른 형식에서 변환",
    selectLanguage: "언어 선택",
    downloadApp: "앱 다운로드",
    getApp: "이동 중에도 사용할 수 있는 PDF 도구를 위한 모바일 앱을 다운로드하세요",
    appStores: "ScanPro 앱 다운로드",
    mobileTools: "이동 중 PDF 도구",
    signIn: "로그인",
    signUp: "회원가입",
    signOut: "로그아웃",
    dashboard: "대시보드",
    profile: "프로필",
    account: "계정"
  },
  auth: {
    email: "이메일",
    emailPlaceholder: "name@example.com",
    password: "비밀번호",
    passwordPlaceholder: "당신의 비밀번호",
    confirmPassword: "비밀번호 확인",
    confirmPasswordPlaceholder: "비밀번호를 확인하세요",
    forgotPassword: "비밀번호를 잊으셨나요?",
    rememberMe: "로그인 유지",
    signIn: "로그인",
    signingIn: "로그인 중...",
    orContinueWith: "또는 다음으로 계속",
    dontHaveAccount: "계정이 없으신가요?",
    signUp: "회원가입",
    loginSuccess: "로그인 성공",
    loginError: "오류가 발생했습니다. 다시 시도해주세요.",
    invalidCredentials: "이메일 또는 비밀번호가 잘못되었습니다",
    emailRequired: "이메일이 필요합니다",
    passwordRequired: "비밀번호가 필요합니다",
    invalidEmail: "유효한 이메일 주소를 입력해주세요",
    name: "이름",
    namePlaceholder: "당신의 이름",
    createAccount: "계정 생성",
    creatingAccount: "계정 생성 중...",
    alreadyHaveAccount: "이미 계정이 있으신가요?",
    nameRequired: "이름이 필요합니다",
    passwordLength: "비밀번호는 최소 8자 이상이어야 합니다",
    passwordStrength: "비밀번호 강도",
    passwordWeak: "약함",
    passwordFair: "보통",
    passwordGood: "좋음",
    passwordStrong: "강함",
    passwordsDoNotMatch: "비밀번호가 일치하지 않습니다",
    agreeTerms: "다음에 동의합니다",
    termsOfService: "서비스 약관",
    and: "및",
    privacyPolicy: "개인정보 보호정책",
    agreeToTerms: "서비스 약관에 동의해주세요",
    registrationFailed: "등록 실패",
    accountCreated: "계정이 성공적으로 생성되었습니다",
    unknownError: "오류가 발생했습니다",
    forgotInstructions: "이메일을 입력하면 비밀번호 재설정 지침을 보내드리겠습니다.",
    sendResetLink: "재설정 링크 보내기",
    sending: "보내는 중...",
    resetEmailSent: "비밀번호 재설정 이메일이 전송되었습니다",
    resetPasswordError: "재설정 이메일 전송 실패",
    checkYourEmail: "이메일을 확인하세요",
    resetInstructions: "해당 이메일로 계정이 존재한다면, 비밀번호 재설정 지침을 보냈습니다.",
    didntReceiveEmail: "이메일을 받지 못했나요?",
    tryAgain: "다시 시도",
    backToLogin: "로그인으로 돌아가기"
  },
  dashboard: {
    title: "대시보드",
    overview: "개요",
    apiKeys: "API 키",
    subscription: "구독",
    profile: "프로필",
    totalUsage: "총 사용량",
    operations: "이번 달 작업",
    active: "활성",
    inactive: "비활성",
    keysAllowed: "허용된 키",
    mostUsed: "가장 많이 사용됨",
    of: "중",
    files: "파일",
    usageByOperation: "작업별 사용량",
    apiUsageBreakdown: "이번 달 당신의 API 사용 내역",
    noData: "데이터 없음",
    createApiKey: "API 키 생성",
    revokeApiKey: "API 키 취소",
    confirmRevoke: "이 API 키를 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    keyRevoked: "API 키가 성공적으로 취소되었습니다",
    noApiKeys: "API 키 없음",
    noApiKeysDesc: "아직 API 키를 생성하지 않았습니다.",
    createFirstApiKey: "첫 번째 API 키 생성",
    keyName: "키 이름",
    keyNamePlaceholder: "내 API 키",
    keyNameDesc: "나중에 쉽게 식별할 수 있도록 키에 설명적인 이름을 지정하세요.",
    permissions: "권한",
    generateKey: "키 생성",
    newApiKeyCreated: "새 API 키가 생성되었습니다",
    copyKeyDesc: "지금 이 키를 복사하세요. 보안상의 이유로 다시 볼 수 없습니다!",
    copyAndClose: "복사 후 닫기",
    keyCopied: "API 키가 클립보드에 복사되었습니다",
    lastUsed: "마지막 사용",
    never: "사용 안 함"
  },
  subscription: {
    currentPlan: "현재 플랜",
    subscriptionDetails: "구독 세부 정보 및 사용 제한",
    plan: "플랜",
    free: "무료",
    basic: "기본",
    pro: "프로",
    enterprise: "엔터프라이즈",
    renewsOn: "구독 갱신일",
    cancelSubscription: "구독 취소",
    changePlan: "플랜 변경",
    upgrade: "업그레이드",
    downgrade: "다운그레이드",
    features: "기능",
    limitations: "제한",
    confirm: "확인",
    cancel: "취소",
    subscriptionCanceled: "구독이 성공적으로 취소되었습니다",
    upgradeSuccess: "구독이 성공적으로 업그레이드되었습니다",
    pricingPlans: "가격 플랜",
    monthly: "월",
    operationsPerMonth: "월별 작업",
    requestsPerHour: "시간당 요청",
    apiKey: "API 키",
    apiKeys: "API 키",
    basicPdf: "기본 PDF 작업",
    allPdf: "모든 PDF 작업",
    basicOcr: "기본 기본 OCR",
    advancedOcr: "고급 OCR",
    prioritySupport: "우선 지원",
    customWatermarks: "사용자 지정 워터마크",
    noWatermarking: "워터마크 없음",
    limitedOcr: "제한된 OCR",
    noPrioritySupport: "우선 지원 없음",
    dedicatedSupport: "전담 지원",
    customIntegration: "사용자 지정 통합 지원",
    whiteLabel: "화이트 라벨 옵션"
  },
  profile: {
    title: "프로필 정보",
    subtitle: "개인 정보 업데이트",
    changePassword: "비밀번호 변경",
    changePasswordDesc: "계정 비밀번호 업데이트",
    currentPassword: "현재 비밀번호",
    newPassword: "새 비밀번호",
    profileUpdated: "프로필이 성공적으로 업데이트되었습니다",
    passwordUpdated: "비밀번호가 성공적으로 업데이트되었습니다",
    updateProfile: "프로필 업데이트",
    updating: "업데이트 중...",
    emailCannotChange: "이메일은 변경할 수 없습니다",
    passwordChanged: "비밀번호가 성공적으로 변경되었습니다",
    incorrectPassword: "현재 비밀번호가 잘못되었습니다"
  },

  // Hero section
  hero: {
    badge: "강력한 PDF 도구",
    title: "올인원 PDF 변환기 및 편집기",
    description: "PDF를 변환, 압축, 병합, 분할, 회전, 워터마크 추가 등 무료 온라인 PDF 도구. 설치가 필요 없습니다.",
    btConvert: "변환 시작",
    btTools: "모든 도구 탐색"
  },

  popular: {
    pdfToWord: "PDF에서 Word로",
    pdfToWordDesc: "PDF 파일을 편집 가능한 DOC 및 DOCX 문서로 쉽게 변환합니다.",
    pdfToExcel: "PDF에서 Excel로",
    pdfToExcelDesc: "PDF에서 데이터를 몇 초 만에 Excel 스프레드시트로 바로 가져옵니다.",
    pdfToPowerPoint: "PDF에서 PowerPoint로",
    pdfToPowerPointDesc: "PDF 프레젠테이션을 편집 가능한 PowerPoint 슬라이드로 변환합니다.",
    pdfToJpg: "PDF에서 JPG로",
    pdfToJpgDesc: "PDF 페이지를 JPG 이미지로 변환하거나 PDF에서 모든 이미지를 추출합니다.",
    pdfToPng: "PDF에서 PNG로",
    pdfToPngDesc: "PDF 페이지를 고품질 투명 PNG 이미지로 변환합니다.",
    pdfToHtml: "PDF에서 HTML로",
    pdfToHtmlDesc: "PDF 문서를 웹 친화적인 HTML 형식으로 변환합니다.",
    wordToPdf: "Word에서 PDF로",
    wordToPdfDesc: "Word 문서를 완벽한 형식과 레이아웃으로 PDF로 변환합니다.",
    excelToPdf: "Excel에서 PDF로",
    excelToPdfDesc: "Excel 스프레드시트를 완벽하게 형식화된 PDF 문서로 변환합니다.",
    powerPointToPdf: "PowerPoint에서 PDF로",
    powerPointToPdfDesc: "PowerPoint 프레젠테이션을 PDF로 변환하여 쉽게 공유할 수 있습니다.",
    jpgToPdf: "JPG에서 PDF로",
    jpgToPdfDesc: "JPG 이미지에서 사용자 정의 옵션으로 PDF 파일을 생성합니다.",
    pngToPdf: "PNG에서 PDF로",
    pngToPdfDesc: "PNG 이미지를 투명 배경 지원으로 PDF로 변환합니다.",
    htmlToPdf: "HTML에서 PDF로",
    htmlToPdfDesc: "웹페이지 및 HTML 콘텐츠를 PDF 문서로 변환합니다.",
    mergePdf: "PDF 병합",
    mergePdfDesc: "가장 쉬운 PDF 병합 도구로 원하는 순서대로 PDF를 결합합니다.",
    splitPdf: "PDF 분할",
    splitPdfDesc: "특정 페이지를 추출하거나 PDF를 여러 문서로 분할합니다.",
    compressPdf: "PDF 압축",
    compressPdfDesc: "최대 PDF 품질을 유지하면서 파일 크기를 줄입니다.",
    rotatePdf: "PDF 회전",
    rotatePdfDesc: "필요에 따라 PDF 페이지를 회전하여 페이지 방향을 변경합니다.",
    watermark: "워터마크 추가",
    watermarkDesc: "텍스트 또는 이미지 워터마크를 추가하여 PDF 문서를 보호하고 브랜드화합니다.",
    unlockPdf: "PDF 잠금 해제",
    unlockPdfDesc: "PDF 파일에서 비밀번호 보호 및 제한을 제거합니다.",
    protectPdf: "PDF 보호",
    protectPdfDesc: "비밀번호 보호를 추가하여 PDF 문서를 안전하게 보호합니다.",
    signPdf: "PDF 서명",
    signPdfDesc: "PDF 문서에 디지털 서명을 안전하게 추가합니다.",
    ocr: "OCR",
    ocrDesc: "광학 문자 인식(OCR)을 사용하여 스캔된 문서에서 텍스트를 추출합니다.",
    editPdf: "PDF 편집",
    editPdfDesc: "PDF 문서에서 텍스트, 이미지 및 페이지를 변경합니다.",
    redactPdf: "PDF 수정",
    redactPdfDesc: "PDF 파일에서 민감한 정보를 영구적으로 제거합니다.",
    viewAll: "모든 PDF 도구 보기"
  },

  // Converter section
  converter: {
    title: "변환 시작",
    description: "PDF를 업로드하고 변환하고 싶은 형식을 선택하세요",
    tabUpload: "업로드 및 변환",
    tabApi: "API 통합",
    apiTitle: "우리의 API와 통합",
    apiDesc: "REST API를 사용하여 애플리케이션에서 프로그래밍 방식으로 PDF를 변환하세요",
    apiDocs: "API 문서 보기"
  },

  // Convert Page
  convert: {
    title: {
      pdfToWord: "PDF에서 Word로 변환",
      pdfToExcel: "PDF에서 Excel로 변환",
      pdfToPowerPoint: "PDF에서 PowerPoint로 변환",
      pdfToJpg: "PDF에서 JPG로 변환",
      pdfToPng: "PDF에서 PNG로 변환",
      pdfToHtml: "PDF에서 HTML로 변환",
      wordToPdf: "Word에서 PDF로 변환",
      excelToPdf: "Excel에서 PDF로 변환",
      powerPointToPdf: "PowerPoint에서 PDF로 변환",
      jpgToPdf: "JPG에서 PNG로 변환",
      pngToPdf: "PNG에서 PDF로 변환",
      htmlToPdf: "HTML에서 PDF로 변환",
      generic: "파일 변환"
    },
    description: {
      pdfToWord: "PDF 문서를 빠르고 쉽게 편집 가능한 Word 파일로 변환합니다",
      pdfToExcel: "PDF 파일에서 표와 데이터를 Excel 스프레드시트로 추출합니다",
      pdfToPowerPoint: "PDF 프레젠테이션을 편집 가능한 PowerPoint 슬라이드로 변환합니다",
      pdfToJpg: "PDF 페이지를 고품질 JPG 이미지로 변환합니다",
      pdfToPng: "PDF 페이지를 투명 PNG 이미지로 변환합니다",
      pdfToHtml: "PDF 문서를 HTML 웹 페이지로 변환합니다",
      wordToPdf: "Word 문서를 완벽한 형식으로 PDF 형식으로 변환합니다",
      excelToPdf: "Excel 스프레드시트를 PDF 문서로 변환합니다",
      powerPointToPdf: "PowerPoint 프레젠테이션을 PDF 형식으로 변환합니다",
      jpgToPdf: "JPG 이미지에서 PDF 파일을 생성합니다",
      pngToPdf: "PNG 이미지에서 PDF 파일을 생성합니다",
      htmlToPdf: "HTML 웹 페이지를 PDF 문서로 변환합니다",
      generic: "형식 간 변환을 위해 파일을 선택하세요"
    },
    howTo: {
      title: "{from}에서 {to}로 변환하는 방법",
      step1: {
        title: "업로드",
        description: "변환하고 싶은 {from} 파일을 업로드하세요"
      },
      step2: {
        title: "변환",
        description: "변환 버튼을 클릭하면 시스템이 파일을 처리합니다"
      },
      step3: {
        title: "다운로드",
        description: "변환된 {to} 파일을 다운로드하세요"
      }
    },
    options: {
      title: "변환 옵션",
      ocr: "OCR(광학 문자 인식) 활성화",
      ocrDescription: "스캔된 문서나 이미지에서 텍스트를 추출합니다",
      preserveLayout: "원본 레이아웃 유지",
      preserveLayoutDescription: "원본 문서의 형식과 레이아웃을 유지합니다",
      quality: "출력 품질",
      qualityDescription: "변환된 파일의 품질 수준을 설정합니다",
      qualityOptions: {
        low: "낮음 (작은 파일 크기)",
        medium: "중간 (균형)",
        high: "높음 (최고 품질)"
      },
      pageOptions: "페이지 옵션",
      allPages: "모든 페이지",
      selectedPages: "선택한 페이지",
      pageRangeDescription: "페이지 번호 및/또는 페이지 범위를 쉼표로 구분하여 입력하세요",
      pageRangeExample: "예: 1,3,5-12"
    },
    moreTools: "관련 변환 도구",
    expertTips: {
      title: "전문가 팁",
      pdfToWord: [
        "최상의 결과를 위해 PDF에 명확하고 기계로 읽을 수 있는 텍스트가 있는지 확인하세요",
        "스캔된 문서 또는 이미지 기반 PDF에 대해 OCR을 활성화하세요",
        "복잡한 레이아웃은 변환 후 약간의 조정이 필요할 수 있습니다"
      ],
      pdfToExcel: [
        "경계가 명확한 표는 더 정확하게 변환됩니다",
        "데이터 추출을 개선하려면 스캔된 PDF를 OCR로 전처리하세요",
        "변환 후 스프레드시트 수식이 전송되지 않을 수 있으므로 확인하세요"
      ],
      generic: [
        "높은 품질 설정은 더 큰 파일 크기를 초래합니다",
        "스캔된 텍스트 또는 텍스트가 포함된 이미지 문서에 OCR을 사용하세요",
        "정확성을 확인하기 위해 변환 후 파일을 미리 보세요"
      ]
    },
    advantages: {
      title: "{from}을 {to}로 변환의 장점",
      pdfToWord: [
        "PDF 형식에 잠겨 있던 텍스트를 편집하고 수정할 수 있습니다",
        "전체 문서를 다시 만들지 않고 콘텐츠를 업데이트하세요",
        "다른 문서에서 사용할 정보를 추출하세요"
      ],
      pdfToExcel: [
        "정적인 PDF 형식의 데이터를 분석하고 조작할 수 있습니다",
        "추출된 데이터로 차트를 만들고 계산을 수행하세요",
        "재무 보고서나 숫자 정보를 쉽게 업데이트하세요"
      ],
      wordToPdf: [
        "형식을 유지하는 보편적으로 읽을 수 있는 문서를 만드세요",
        "원치 않는 수정으로부터 콘텐츠를 보호하세요",
        "모든 기기와 플랫폼에서 일관된 모습을 보장하세요"
      ],
      generic: [
        "문서를 더 유용한 형식으로 변환하세요",
        "대상 형식을 지원하는 프로그램에서 콘텐츠에 접근하고 사용하세요",
        "다른 사람들이 쉽게 열 수 있는 형식으로 파일을 공유하세요"
      ]
    }
  },

  // Features section
  features: {
    title: "기능",
    description: "PDF 파일을 변환하고 관리하는 데 필요한 모든 것",
    documentFormats: {
      title: "문서 형식",
      description: "DOCX, DOC, RTF, ODT 등으로 완벽한 형식과 레이아웃 보존과 함께 변환"
    },
    spreadsheets: {
      title: "스프레드시트",
      description: "PDF를 XLSX, CSV 및 기타 스프레드시트 형식으로 적절한 셀 구조와 함께 변환"
    },
    images: {
      title: "이미지",
      description: "PDF 파일에서 고품질 JPG 및 PNG 이미지를 해상도 조절과 함께 추출"
    },
    webFormats: {
      title: "웹 형식",
      description: "온라인 게시를 위해 HTML 및 기타 웹 친화적인 형식으로 변환"
    },
    ocrTech: {
      title: "OCR 기술",
      description: "고급 광학 문자 인식으로 스캔된 문서에서 텍스트 추출"
    },
    batchProcessing: {
      title: "일괄 처리",
      description: "효율적인 일괄 처리를 통해 한 번에 여러 PDF를 변환하여 시간 절약"
    }
  },

  // CTA section
  cta: {
    title: "변환 준비가 되셨나요?",
    description: "필요한 모든 형식으로 PDF를 완전히 무료로 변환하세요.",
    startConverting: "변환 시작",
    exploreTools: "모든 도구 탐색"
  },

  // PDF Tools Page
  pdfTools: {
    title: "모든 PDF 도구",
    description: "PDF 작업에 필요한 모든 것이 한 곳에",
    categories: {
      convertFromPdf: "PDF에서 변환",
      convertToPdf: "PDF로 변환",
      basicTools: "기본 도구",
      organizePdf: "PDF 정리",
      pdfSecurity: "PDF 보안"
    }
  },

  // Tool Descriptions
  toolDescriptions: {
    pdfToWord: "PDF 파일을 편집 가능한 DOC 및 DOCX 문서로 쉽게 변환합니다.",
    pdfToPowerpoint: "PDF 파일을 편집 가능한 PPT 및 PPTX 슬라이드쇼로 변환합니다.",
    pdfToExcel: "PDF에서 데이터를 몇 초 만에 Excel 스프레드시트로 바로 가져옵니다.",
    pdfToJpg: "각 PDF 페이지를 JPG로 변환하거나 PDF에 포함된 모든 이미지를 추출합니다.",
    pdfToPng: "각 PDF 페이지를 PNG로 변환하거나 PDF에 포함된 모든 이미지를 추출합니다.",
    pdfToHtml: "HTML 웹페이지를 PDF로 변환합니다. 페이지 URL을 복사하여 붙여넣으세요.",
    wordToPdf: "DOC 및 DOCX 파일을 PDF로 변환하여 읽기 쉽게 만드세요.",
    powerpointToPdf: "PPT 및 PPTX 슬라이드쇼를 PDF로 변환하여 보기 쉽게 만드세요.",
    excelToPdf: "Excel 스프레드시트를 PDF로 변환하여 읽기 쉽게 만드세요.",
    jpgToPdf: "JPG 이미지를 몇 초 안에 PDF로 변환합니다. 방향과 여백을 쉽게 조정하세요.",
    pngToPdf: "PNG 이미지를 몇 초 안에 PDF로 변환합니다. 방향과 여백을 쉽게 조정하세요.",
    htmlToPdf: "웹페이지를 PDF로 변환합니다. URL을 복사하여 붙여넣으면 PDF로 변환됩니다.",
    mergePdf: "가장 쉬운 PDF 병합 도구로 원하는 순서대로 PDF를 결합합니다.",
    splitPdf: "PDF 파일을 여러 문서로 분할하거나 PDF에서 특정 페이지를 추출하세요.",
    compressPdf: "최대 PDF 품질을 유지하면서 파일 크기를 줄입니다.",
    rotatePdf: "필요한 대로 PDF를 회전하세요. 여러 PDF를 한 번에 회전할 수도 있습니다!",
    watermark: "몇 초 안에 PDF 위에 이미지나 텍스트를 스탬프하세요. 글꼴, 투명도, 위치를 선택하세요.",
    unlockPdf: "PDF 비밀번호 보안을 제거하여 원하는 대로 PDF를 자유롭게 사용하세요.",
    protectPdf: "PDF 파일을 비밀번호로 보호하세요. 무단 접근을 방지하기 위해 PDF 문서를 암호화합니다.",
    ocr: "광학 문자 인식(OCR)을 사용하여 스캔된 문서에서 텍스트를 추출합니다."
  },
  splitPdf: {
    title: "PDF 분할",
    description: "PDF 파일을 여러 문서로 분할하거나 특정 페이지를 추출하세요",
    howTo: {
      title: "PDF 파일을 분할하는 방법",
      step1: {
        title: "업로드",
        description: "분할하거나 페이지를 추출하려는 PDF 파일을 업로드하세요"
      },
      step2: {
        title: "분할 방법 선택",
        description: "PDF를 분할하는 방법을 선택하세요: 페이지 범위별, 각 페이지 추출, 또는 N페이지마다 분할"
      },
      step3: {
        title: "다운로드",
        description: "분할된 PDF 파일을 개별적으로 다운로드하세요"
      }
    },
    options: {
      splitMethod: "분할 방법",
      byRange: "페이지 범위별 분할",
      extractAll: "모든 페이지를 개별 PDF로 추출",
      everyNPages: "N페이지마다 분할",
      everyNPagesNumber: "파일당 페이지 수",
      everyNPagesHint: "각 출력 파일은 이 수의 페이지를 포함합니다",
      pageRanges: "페이지 범위",
      pageRangesHint: "쉼표로 구분된 페이지 범위를 입력하세요. 예: 1-5, 8, 11-13은 3개의 PDF 파일을 생성합니다"
    },
    splitting: "PDF 분할 중...",
    splitDocument: "문서 분할",
    splitSuccess: "PDF가 성공적으로 분할되었습니다!",
    splitSuccessDesc: "당신의 PDF는 {count}개의 개별 파일로 분할되었습니다",
    results: {
      title: "PDF 분할 결과",
      part: "부분",
      pages: "페이지",
      pagesCount: "페이지"
    },
    faq: {
      title: "자주 묻는 질문",
      q1: {
        question: "분할 후 PDF 파일은 어떻게 되나요?",
        answer: "업로드 및 생성된 모든 파일은 개인정보 보호와 보안을 위해 24시간 후에 서버에서 자동으로 삭제됩니다."
      },
      q2: {
        question: "분할할 수 있는 페이지 수에 제한이 있나요?",
        answer: "무료 버전에서는 최대 100페이지까지 PDF를 분할할 수 있습니다. 더 큰 문서의 경우 프리미엄 플랜을 고려하세요."
      },
      q3: {
        question: "PDF에서 특정 페이지를 추출할 수 있나요?",
        answer: "네, \"페이지 범위별 분할\" 옵션을 사용하여 PDF 문서에서 특정 페이지 또는 페이지 범위를 추출할 수 있습니다."
      },
      q4: {
        question: "분할 중에 페이지를 재정렬할 수 있나요?",
        answer: "현재 분할 도구는 원래 페이지 순서를 유지합니다. 페이지를 재정렬하려면 추출된 페이지로 PDF 병합 도구를 사용해야 합니다."
      }
    },
    useCases: {
      title: "PDF 분할의 인기 있는 사용 사례",
      chapters: {
        title: "챕터 분리",
        description: "큰 책이나 보고서를 개별 챕터로 분할하여 탐색과 공유를 쉽게 합니다"
      },
      extract: {
        title: "페이지 추출",
        description: "긴 문서에서 양식, 증명서, 중요한 섹션과 같은 특정 페이지를 추출합니다"
      },
      remove: {
        title: "페이지 제거",
        description: "필요한 모든 페이지를 추출하고 광고나 빈 페이지와 같은 불필요한 콘텐츠를 제외합니다"
      },
      size: {
        title: "크기 축소",
        description: "큰 PDF를 작은 파일로 나누어 이메일이나 메시지 앱을 통해 쉽게 공유합니다"
      }
    }
  },
  // Merge PDF Page
  mergePdf: {
    title: "PDF 파일 병합",
    description: "여러 PDF 파일을 빠르고 쉽게 하나의 문서로 결합합니다",
    howTo: {
      title: "PDF 파일 병합 방법",
      step1: {
        title: "파일 업로드",
        description: "결합하려는 PDF 파일을 업로드하세요. 한 번에 여러 파일을 선택할 수 있습니다."
      },
      step2: {
        title: "순서 정렬",
        description: "최종 PDF에 나타날 순서대로 파일을 드래그 앤 드롭하여 재정렬하세요."
      },
      step3: {
        title: "다운로드",
        description: "PDF 병합 버튼을 클릭하고 결합된 PDF 파일을 다운로드하세요."
      }
    },
    faq: {
      title: "자주 묻는 질문",
      q1: {
        question: "병합할 수 있는 PDF 수에 제한이 있나요?",
        answer: "무료 도구로 최대 20개의 PDF 파일을 한 번에 병합할 수 있습니다. 더 큰 배치의 경우 프리미엄 플랜을 고려하세요."
      },
      q2: {
        question: "PDF 파일이 비공개로 유지되나요?",
        answer: "네, 귀하의 개인 정보가 최우선입니다. 업로드된 모든 파일은 처리 후 서버에서 자동으로 삭제됩니다."
      },
      q3: {
        question: "비밀번호로 보호된 PDF를 병합할 수 있나요?",
        answer: "비밀번호로 보호된 PDF의 경우, 먼저 Unlock PDF 도구를 사용하여 잠금을 해제한 후 병합해야 합니다."
      }
    },
    relatedTools: "더 많은 PDF 도구 탐색",
    viewAllTools: "모든 PDF 도구 보기",
    of: "중",
    files: "파일",
    filesToMerge: "병합할 파일"
  },

  // OCR Page
  ocr: {
    title: "OCR 텍스트 추출",
    description: "강력한 광학 문자 인식 기술을 사용하여 스캔된 PDF 및 이미지에서 텍스트를 추출합니다",
    howTo: {
      title: "OCR 텍스트 추출 작동 방식",
      step1: {
        title: "업로드",
        description: "스캔된 PDF 문서 또는 이미지 기반 PDF 파일을 업로드하세요."
      },
      step2: {
        title: "OCR 설정",
        description: "최상의 결과를 위해 언어, 페이지 범위 및 고급 옵션을 선택하세요."
      },
      step3: {
        title: "텍스트 가져오기",
        description: "추출된 텍스트를 복사하거나 추가 사용을 위해 텍스트 파일로 다운로드하세요."
      }
    },
    faq: {
      title: "자주 묻는 질문",
      questions: {
        accuracy: {
          question: "OCR 텍스트 추출의 정확도는 얼마나 되나요?",
          answer: "저희 OCR 기술은 잘 스캔된 문서에서 명확하게 인쇄된 텍스트에 대해 일반적으로 90-99%의 정확도를 달성합니다. 스캔 품질이 낮거나 특이한 글꼴, 복잡한 레이아웃에서는 정확도가 낮아질 수 있습니다."
        },
        languages: {
          question: "어떤 언어가 지원되나요?",
          answer: "영어, 프랑스어, 독일어, 스페인어, 이탈리아어, 포르투갈어, 중국어, 일본어, 한국어, 러시아어, 아랍어, 힌디어 등 100개 이상의 언어를 지원합니다."
        },
        recognition: {
          question: "텍스트가 제대로 인식되지 않는 이유는 무엇인가요?",
          answer: "OCR 정확도에 영향을 미치는 여러 요인이 있습니다: 문서 품질, 해상도, 대비, 복잡한 레이아웃, 손글씨, 특이한 글꼴, 또는 잘못된 언어 선택."
        },
        pageLimit: {
          question: "처리할 수 있는 페이지 수에 제한이 있나요?",
          answer: "무료 사용자는 PDF당 최대 50페이지를 처리할 수 있습니다. 프리미엄 사용자는 최대 500페이지의 PDF를 처리할 수 있습니다."
        },
        security: {
          question: "OCR 처리 중 데이터가 안전한가요?",
          answer: "네, 귀하의 보안이 최우선입니다. 업로드된 모든 파일은 보안 서버에서 처리되며 처리 후 자동으로 삭제됩니다."
        }
      }
    },
    relatedTools: "관련 PDF 도구",
    processing: {
      title: "OCR 처리 중",
      message: "OCR 처리는 문서 크기와 복잡성에 따라 몇 분이 걸릴 수 있습니다"
    },
    results: {
      title: "추출된 텍스트",
      copy: "복사",
      download: ".txt 다운로드"
    },
    languages: {
      english: "영어",
      french: "프랑스어",
      german: "독일어",
      spanish: "스페인어",
      chinese: "중국어",
      japanese: "일본어",
      arabic: "아랍어",
      russian: "러시아어"
    },
    whatIsOcr: {
      title: "광학 문자 인식(OCR)",
      description: "스캔된 종이 문서, PDF 파일 또는 디지털 카메라로 캡처한 이미지와 같은 다양한 유형의 문서를 편집 가능하고 검색 가능한 데이터로 변환하는 기술입니다.",
      explanation: "OCR은 문서 이미지의 구조를 분석하고, 문자와 텍스트 요소를 식별한 후 이를 기계로 읽을 수 있는 형식으로 변환합니다.",
      extractionList: {
        scannedPdfs: "텍스트가 이미지로 존재하는 스캔된 PDF",
        imageOnlyPdfs: "기본 텍스트 레이어가 없는 이미지 전용 PDF",
        embeddedImages: "텍스트가 포함된 임베디드 이미지가 있는 PDF",
        textCopyingIssues: "텍스트를 직접 복사할 수 없는 문서"
      }
    },
    whenToUse: {
      title: "OCR 텍스트 추출을 언제 사용해야 하나요",
      idealFor: "이상적인 경우:",
      idealForList: {
        scannedDocuments: "PDF로 저장된 스캔 문서",
        oldDocuments: "디지털 텍스트 레이어가 없는 오래된 문서",
        textSelectionIssues: "텍스트 선택/복사가 작동하지 않는 PDF",
        textInImages: "추출해야 할 텍스트가 포함된 이미지",
        searchableArchives: "스캔된 문서에서 검색 가능한 아카이브 생성"
      },
      notNecessaryFor: "필요하지 않은 경우:",
      notNecessaryForList: {
        digitalPdfs: "텍스트를 이미 선택할 수 있는 네이티브 디지털 PDF",
        createdDigitally: "디지털 문서에서 직접 생성된 PDF",
        copyPasteAvailable: "이미 텍스트를 복사하고 붙여넣을 수 있는 문서",
        formatPreservation: "형식 보존이 필요한 파일 (대신 PDF에서 DOCX로 변환 사용)"
      }
    },
    limitations: {
      title: "OCR 제한 및 팁",
      description: "저희 OCR 기술은 강력하지만 몇 가지 주의할 제한이 있습니다:",
      factorsAffecting: "OCR 정확도에 영향을 미치는 요인:",
      factorsList: {
        documentQuality: "문서 품질 (해상도, 대비)",
        complexLayouts: "복잡한 레이아웃 및 서식",
        handwrittenText: "손글씨 텍스트 (제한된 인식)",
        specialCharacters: "특수 문자 및 기호",
        multipleLanguages: "한 문서 내 여러 언어"
      },
      tipsForBest: "최상의 결과를 위한 팁:",
      tipsList: {
        highQualityScans: "고품질 스캔 사용 (300 DPI 이상)",
        correctLanguage: "문서에 맞는 올바른 언어 선택",
        enhanceScannedImages: "더 나은 정확도를 위해 \"스캔 이미지 향상\" 활성화",
        smallerPageRanges: "큰 문서의 경우 작은 페이지 범위 처리",
        reviewText: "추출된 텍스트 검토 및 수정"
      }
    },
    options: {
      scope: "추출할 페이지",
      all: "모든 페이지",
      custom: "특정 페이지",
      pages: "페이지 번호",
      pagesHint: "예: 1,3,5-9",
      enhanceScanned: "스캔 이미지 향상",
      enhanceScannedHint: "OCR 정확도를 높이기 위해 이미지를 전처리 (스캔 문서에 권장)",
      preserveLayout: "레이아웃 유지",
      preserveLayoutHint: "단락과 줄 바꿈으로 원본 레이아웃을 유지하려고 시도"
    }
  },

  // Protect PDF Page
  protectPdf: {
    title: "PDF 비밀번호 보호",
    description: "비밀번호 보호 및 사용자 지정 접근 권한으로 PDF 문서를 안전하게 보호하세요",
    howTo: {
      title: "PDF 보호 방법",
      step1: {
        title: "업로드",
        description: "비밀번호로 보호하려는 PDF 파일을 업로드하세요."
      },
      step2: {
        title: "보안 옵션 설정",
        description: "비밀번호를 생성하고 인쇄, 복사, 편집에 대한 권한을 사용자 지정하세요."
      },
      step3: {
        title: "다운로드",
        description: "안전한 공유를 위해 비밀번호로 보호된 PDF 파일을 다운로드하세요."
      }
    },
    why: {
      title: "PDF를 보호해야 하는 이유",
      confidentiality: {
        title: "기밀성",
        description: "비밀번호를 가진 승인된 개인만 민감한 문서를 열고 볼 수 있도록 보장합니다."
      },
      controlledAccess: {
        title: "제어된 접근",
        description: "받는 사람이 문서로 무엇을 할 수 있는지(예: 인쇄 또는 편집)를 결정하는 특정 권한을 설정합니다."
      },
      authorizedDistribution: {
        title: "승인된 배포",
        description: "계약서, 연구 또는 지적 재산을 공유할 때 문서에 접근할 수 있는 사람을 제어합니다."
      },
      documentExpiration: {
        title: "문서 만료",
        description: "비밀번호 보호는 무기한 접근 가능하지 않아야 하는 시간에 민감한 문서에 추가 보안 계층을 추가합니다."
      }
    },
    security: {
      title: "PDF 보안 이해",
      passwords: {
        title: "사용자 비밀번호 vs. 소유자 비밀번호",
        user: "사용자 비밀번호: 문서를 여는 데 필요합니다. 이 비밀번호가 없으면 콘텐츠를 볼 수 없습니다.",
        owner: "소유자 비밀번호: 권한을 제어합니다. 저희 도구에서는 간단하게 하기 위해 두 비밀번호를 동일하게 설정합니다."
      },
      encryption: {
        title: "암호화 수준",
        aes128: "128비트 AES: 좋은 보안을 제공하며 Acrobat Reader 7 이상 버전과 호환됩니다.",
        aes256: "256비트 AES: 더 강력한 보안을 제공하지만 Acrobat Reader X (10) 이상 버전이 필요합니다."
      },
      permissions: {
        title: "권한 제어",
        printing: {
          title: "인쇄",
          description: "문서를 인쇄할 수 있는지와 어떤 품질 수준으로 할 수 있는지를 제어합니다."
        },
        copying: {
          title: "콘텐츠 복사",
          description: "텍스트와 이미지를 선택하고 클립보드에 복사할 수 있는지를 제어합니다."
        },
        editing: {
          title: "편집",
          description: "주석, 양식 작성, 콘텐츠 변경을 포함한 문서 수정을 제어합니다."
        }
      }
    },
    form: {
      password: "비밀번호",
      confirmPassword: "비밀번호 확인",
      encryptionLevel: "암호화 수준",
      permissions: {
        title: "접근 권한",
        allowAll: "모두 허용 (열기만 비밀번호 필요)",
        restricted: "제한된 접근 (사용자 지정 권한)"
      },
      allowedActions: "허용된 작업:",
      allowPrinting: "인쇄 허용",
      allowCopying: "텍스트 및 이미지 복사 허용",
      allowEditing: "편집 및 주석 허용"
    },
    bestPractices: {
      title: "비밀번호 보호 모범 사례",
      dos: "해야 할 일",
      donts: "하지 말아야 할 일",
      dosList: [
        "문자, 숫자, 특수 문자가 섞인 강력하고 고유한 비밀번호 사용",
        "비밀번호 관리자에 비밀번호를 안전하게 저장",
        "PDF와 별도의 안전한 채널을 통해 비밀번호 공유",
        "매우 민감한 문서에 256비트 암호화 사용"
      ],
      dontsList: [
        "\"password123\" 또는 \"1234\"와 같은 단순하고 추측하기 쉬운 비밀번호 사용",
        "PDF와 동일한 이메일로 비밀번호 전송",
        "모든 보호된 PDF에 동일한 비밀번호 사용",
        "매우 민감한 정보에 대해 비밀번호 보호만 의존"
      ]
    },
    faq: {
      encryptionDifference: {
        question: "암호화 수준의 차이점은 무엇인가요?",
        answer: "128비트와 256비트 AES 암호화를 제공합니다. 128비트는 구형 PDF 리더(Acrobat 7 이상)와 호환되며, 256비트는 더 강력한 보안을 제공하지만 최신 리더(Acrobat X 이상)가 필요합니다."
      },
      removeProtection: {
        question: "나중에 비밀번호 보호를 제거할 수 있나요?",
        answer: "네, Unlock PDF 도구를 사용하여 PDF 파일에서 비밀번호 보호를 제거할 수 있지만, 현재 비밀번호를 알아야 합니다."
      },
      securityStrength: {
        question: "비밀번호 보호가 얼마나 안전한가요?",
        answer: "저희 도구는 산업 표준 AES 암호화를 사용합니다. 보안은 비밀번호의 강도와 선택한 암호화 수준에 따라 달라집니다. 문자 조합이 섞인 강력하고 고유한 비밀번호를 권장합니다."
      },
      contentQuality: {
        question: "비밀번호 보호가 PDF 콘텐츠나 품질에 영향을 미치나요?",
        answer: "아니요, 비밀번호 보호는 문서에 보안만 추가하며 PDF의 콘텐츠, 레이아웃 또는 품질을 전혀 변경하지 않습니다."
      },
      batchProcessing: {
        question: "여러 PDF를 한 번에 보호할 수 있나요?",
        answer: "현재 저희 도구는 한 번에 하나의 PDF를 처리합니다. 여러 파일의 일괄 처리를 위해 API 또는 프리미엄 솔루션을 고려하세요."
      }
    },
    protecting: "보호 중...",
    protected: "PDF가 성공적으로 보호되었습니다!",
    protectedDesc: "귀하의 PDF 파일이 암호화되고 비밀번호로 보호되었습니다."
  },

  // Watermark Page
  watermark: {
    title: "PDF에 워터마크 추가",
    description: "사용자 지정 텍스트 워터마크를 추가하여 문서를 보호하세요",
    howTo: {
      title: "워터마크 추가 방법",
      step1: {
        title: "업로드",
        description: "워터마크를 추가하려는 PDF 파일을 업로드하세요. 적용하기 전에 어떻게 보일지 미리 볼 수 있습니다."
      },
      step2: {
        title: "사용자 지정",
        description: "텍스트, 위치, 크기, 색상, 투명도를 필요에 맞게 설정하세요."
      },
      step3: {
        title: "다운로드",
        description: "워터마크가 적용된 PDF 파일을 처리하고 다운로드하여 배포 준비를 하세요."
      }
    },
    form: {
      text: "워터마크 텍스트",
      textColor: "텍스트 색상",
      opacity: "투명도",
      size: "크기",
      rotation: "회전",
      position: "위치",
      pages: "워터마크를 추가할 페이지",
      allPages: "모든 페이지",
      specificPages: "특정 페이지",
      pageNumbers: "페이지 번호",
      pageNumbersHint: "페이지 번호를 쉼표로 구분하여 입력하세요 (예: 1,3,5,8)"
    },
    positions: {
      topLeft: "왼쪽 상단",
      topCenter: "중앙 상단",
      topRight: "오른쪽 상단",
      centerLeft: "왼쪽 중앙",
      center: "중앙",
      centerRight: "오른쪽 중앙",
      bottomLeft: "왼쪽 하단",
      bottomCenter: "중앙 하단",
      bottomRight: "오른쪽 하단"
    },
    preview: {
      title: "워터마크 미리보기",
      note: "이것은 단순화된 미리보기입니다. 실제 결과는 다를 수 있습니다."
    },
    faq: {
      title: "자주 묻는 질문",
      q1: {
        question: "어떤 종류의 워터마크를 추가할 수 있나요?",
        answer: "저희 도구는 내용, 위치, 크기, 색상, 투명도, 회전을 사용자 지정할 수 있는 텍스트 워터마크를 지원합니다. \"기밀\", \"초안\" 또는 회사 이름과 같은 워터마크를 추가할 수 있습니다."
      },
      q2: {
        question: "PDF의 특정 페이지만 워터마크를 추가할 수 있나요?",
        answer: "네, 모든 페이지에 워터마크를 추가하거나 페이지 번호를 입력하여 워터마크를 추가할 페이지를 지정할 수 있습니다."
      },
      q3: {
        question: "워터마크는 영구적인가요?",
        answer: "네, 워터마크는 PDF 문서에 영구적으로 삽입됩니다. 그러나 콘텐츠의 가시성과 가독성을 조화롭게 유지하기 위해 투명도를 다양하게 설정할 수 있습니다."
      },
      q4: {
        question: "워터마킹이 파일 품질에 영향을 미치나요?",
        answer: "아니요, 저희 워터마킹 도구는 지정된 텍스트만 추가하며 원본 문서 품질이나 파일 크기에 큰 영향을 미치지 않습니다."
      }
    },
    addingWatermark: "PDF에 워터마크 추가 중...",
    watermarkSuccess: "워터마크가 성공적으로 추가되었습니다!",
    watermarkSuccessDesc: "귀하의 PDF 파일에 워터마크가 적용되었으며 다운로드할 준비가 되었습니다."
  },

  // Compress PDF
  compressPdf: {
    title: "PDF 압축",
    description: "품질을 유지하면서 PDF 파일 크기를 줄입니다",
    quality: {
      high: "고품질",
      highDesc: "최소 압축, 최상의 시각 품질",
      balanced: "균형",
      balancedDesc: "최소 시각 손실로 좋은 압축",
      maximum: "최대 압축",
      maximumDesc: "최고 압축 비율, 시각 품질이 저하될 수 있음"
    },
    processing: {
      title: "처리 옵션",
      processAllTogether: "모든 파일을 동시에 처리",
      processSequentially: "파일을 하나씩 처리"
    },
    status: {
      uploading: "업로드 중...",
      compressing: "압축 중...",
      completed: "완료",
      failed: "실패"
    },
    results: {
      title: "압축 결과 요약",
      totalOriginal: "총 원본",
      totalCompressed: "총 압축",
      spaceSaved: "절약된 공간",
      averageReduction: "평균 감소",
      downloadAll: "압축된 모든 파일을 ZIP으로 다운로드"
    },
    of: "중",
    files: "파일",
    filesToCompress: "압축할 파일",
    compressAll: "파일 압축",
    qualityPlaceholder: "압축 품질 선택",
    reduction: "감소",
    zipDownloadSuccess: "모든 압축 파일이 성공적으로 다운로드되었습니다",
    overallProgress: "전체 진행률",
    reducedBy: "감소됨",
    success: "압축 성공",
    error: {
      noFiles: "압축할 PDF 파일을 선택하세요",
      noCompressed: "다운로드할 압축 파일이 없습니다",
      downloadZip: "ZIP 아카이브 다운로드 실패",
      generic: "PDF 파일 압축 실패",
      unknown: "알 수 없는 오류가 발생했습니다",
      failed: "파일 압축에 실패했습니다"
    }
  },

  // Unlock PDF
  unlockPdf: {
    title: "PDF 파일 잠금 해제",
    description: "제한 없는 접근을 위해 PDF 문서에서 비밀번호 보호를 제거합니다",
    howTo: {
      title: "PDF 파일 잠금 해제 방법",
      upload: {
        title: "업로드",
        description: "잠금 해제하려는 비밀번호로 보호된 PDF 파일을 업로드하세요."
      },
      enterPassword: {
        title: "비밀번호 입력",
        description: "필요한 경우, PDF를 보호하는 현재 비밀번호를 입력하세요."
      },
      download: {
        title: "다운로드",
        description: "비밀번호 제한이 없는 잠금 해제된 PDF 파일을 다운로드하세요."
      }
    },
    faq: {
      passwordRequired: {
        question: "현재 비밀번호를 알아야 하나요?",
        answer: "네, PDF 잠금을 해제하려면 현재 비밀번호를 알아야 합니다. 저희 도구는 비밀번호를 우회하거나 해독할 수 없으며, 올바른 비밀번호를 제공한 후 보호를 제거합니다."
      },
      security: {
        question: "잠금 해제 과정이 안전한가요?",
        answer: "네, 모든 처리는 보안 서버에서 이루어집니다. PDF나 비밀번호를 저장하지 않으며, 파일은 처리 후 자동으로 삭제되고 모든 데이터 전송은 암호화됩니다."
      },
      restrictions: {
        question: "열기 비밀번호 없이 소유자 제한이 있는 PDF를 잠금 해제할 수 있나요?",
        answer: "네, 일부 PDF는 열기 비밀번호가 필요 없지만 인쇄, 편집, 복사에 제한이 있습니다. 저희 도구는 비밀번호 입력 없이 파일을 업로드하여 이러한 제한도 제거할 수 있습니다."
      },
      quality: {
        question: "잠금 해제가 PDF 품질이나 콘텐츠에 영향을 미치나요?",
        answer: "아니요, 잠금 해제 과정은 보안 설정만 제거하며 PDF 파일의 콘텐츠, 형식 또는 품질을 전혀 변경하지 않습니다."
      }
    },
    passwordProtected: "비밀번호로 보호됨",
    notPasswordProtected: "비밀번호로 보호되지 않음",
    unlocking: "PDF 잠금 해제 중...",
    unlockSuccess: "PDF가 성공적으로 잠금 해제되었습니다!",
    unlockSuccessDesc: "귀하의 PDF 파일이 잠금 해제되었으며 다운로드할 준비가 되었습니다."
  },

  // File Uploader
  fileUploader: {
    dropHere: "여기에 파일을 놓으세요",
    dropHereaDesc: "여기에 PDF 파일을 놓거나 클릭하여 찾아보세요",
    dragAndDrop: "파일을 드래그 앤 드롭하세요",
    browse: "파일 찾아보기",
    dropHereDesc: "여기에 파일을 놓거나 클릭하여 찾아보세요.",
    maxSize: "최대 크기는 100MB입니다.",
    remove: "제거",
    inputFormat: "입력 형식",
    outputFormat: "출력 형식",
    ocr: "OCR 활성화",
    ocrDesc: "광학 문자 인식(OCR)을 사용하여 스캔된 문서에서 텍스트를 추출합니다",
    quality: "품질",
    low: "낮음",
    high: "높음",
    password: "비밀번호",
    categories: {
      documents: "문서",
      spreadsheets: "스프레드시트",
      presentations: "프레젠테이션",
      images: "이미지"
    },
    converting: "변환 중",
    successful: "변환 성공",
    successDesc: "파일이 성공적으로 변환되었으며 이제 다운로드할 준비가 되었습니다.",
    download: "변환된 파일 다운로드",
    filesSecurity: "파일은 개인 정보 보호와 보안을 위해 24시간 후 자동으로 삭제됩니다."
  },

  // Common UI elements
  ui: {
    upload: "업로드",
    download: "다운로드",
    cancel: "취소",
    confirm: "확인",
    save: "저장",
    next: "다음",
    previous: "이전",
    finish: "완료",
    processing: "처리 중...",
    success: "성공!",
    error: "오류",
    copy: "복사",
    remove: "제거",
    browse: "찾아보기",
    dragDrop: "드래그 앤 드롭",
    or: "또는",
    close: "닫기",
    apply: "적용",
    loading: "로딩 중...",
    preview: "미리보기",
    reupload: "다른 파일 업로드",
    continue: "계속",
    skip: "건너뛰기",
    retry: "재시도",
    addMore: "더 추가",
    clear: "지우기",
    clearAll: "모두 지우기",
    done: "완료",
    extract: "추출",
    new: "신규!",
    phone: "전화",
    address: "주소",
    filesSecurity: "파일은 개인 정보 보호와 보안을 위해 24시간 후 자동으로 삭제됩니다."
  },

  contact: {
    title: "문의하기",
    description: "질문이나 피드백이 있으신가요? 여러분의 의견을 기다립니다.",
    form: {
      title: "메시지 보내기",
      description: "아래 양식을 작성해 주시면 가능한 빨리 연락드리겠습니다.",
      name: "이름",
      email: "이메일 주소",
      subject: "제목",
      message: "메시지",
      submit: "메시지 보내기"
    },
    success: "메시지가 성공적으로 전송되었습니다",
    successDesc: "연락해 주셔서 감사합니다. 가능한 빨리 답변드리겠습니다.",
    error: "메시지 전송 실패",
    errorDesc: "메시지 전송 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
    validation: {
      name: "이름은 필수입니다",
      email: "유효한 이메일 주소를 입력해 주세요",
      subject: "제목은 필수입니다",
      message: "메시지는 필수입니다"
    },
    supportHours: {
      title: "지원 시간",
      description: "도움을 드릴 수 있는 시간",
      weekdays: "월요일 - 금요일",
      weekdayHours: "오전 9:00 - 오후 6:00 EST",
      saturday: "토요일",
      saturdayHours: "오전 10:00 - 오후 4:00 EST",
      sunday: "일요일",
      closed: "휴무"
    },
    faq: {
      title: "자주 묻는 질문",
      responseTime: {
        question: "답변을 받는 데 얼마나 걸리나요?",
        answer: "모든 문의에 대해 영업일 기준 24-48시간 내에 답변을 드리려고 합니다. 피크 시간에는 최대 72시간이 걸릴 수 있습니다."
      },
      technicalSupport: {
        question: "기술 문제에 대한 지원을 받을 수 있나요?",
        answer: "네, 저희 기술 지원 팀은 PDF 도구와 관련된 문제에 대해 도움을 드릴 준비가 되어 있습니다."
      },
      phoneSupport: {
        question: "전화 지원을 제공하나요?",
        answer: "나열된 지원 시간 동안 전화 지원을 제공합니다. 즉각적인 도움을 위해 이메일이 종종 가장 빠른 방법입니다."
      },
      security: {
        question: "개인 정보가 안전한가요?",
        answer: "저희는 귀하의 개인 정보를 중요하게 생각합니다. 모든 통신은 암호화되며, 개인 정보를 제3자와 공유하지 않습니다."
      }
    }
  },
  // About Page
  about: {
    title: "ScanPro 소개",
    mission: {
      title: "우리의 사명",
      description: "우리는 PDF 관리를 누구나 쉽게 할 수 있도록 하는 것을 믿습니다. 저희 온라인 도구는 소프트웨어 설치 없이 PDF 작업을 빠르고 쉽게 할 수 있도록 도와줍니다."
    },
    team: {
      title: "우리의 팀",
      description: "우리는 간단하면서도 강력한 PDF 도구를 만드는 데 열정을 가진 개발자와 디자이너로 구성된 헌신적인 팀입니다."
    },
    technology: {
      title: "우리의 기술",
      description: "저희 플랫폼은 데이터를 안전하게 유지하면서 고품질 PDF 변환, 편집, 보안을 제공하기 위해 최첨단 기술을 사용합니다."
    }
  },

  // Pricing Page
  pricing: {
    title: "간단하고 투명한 가격",
    description: "귀하의 필요에 맞는 플랜을 선택하세요",
    free: {
      title: "무료",
      description: "가끔 사용하는 사용자를 위한 기본 PDF 작업",
      features: [
        "하루 최대 3개 파일 변환",
        "PDF에서 Word, Excel, PowerPoint로",
        "기본 압축",
        "최대 5개 PDF 병합",
        "간단한 워터마크 추가",
        "표준 OCR"
      ]
    },
    pro: {
      title: "프로",
      description: "정기적인 PDF 사용자에게 더 많은 기능",
      features: [
        "무제한 변환",
        "우선 처리",
        "고급 압축",
        "무제한 PDF 병합",
        "사용자 지정 워터마크",
        "100개 이상의 언어를 지원하는 고급 OCR",
        "일괄 처리",
        "광고 없음"
      ]
    },
    business: {
      title: "비즈니스",
      description: "팀을 위한 완벽한 솔루션",
      features: [
        "프로 플랜의 모든 기능",
        "여러 팀원",
        "API 접근",
        "GDPR 준수",
        "전담 지원",
        "사용 분석",
        "사용자 지정 브랜딩 옵션"
      ]
    },
    monthly: "월간",
    annually: "연간",
    savePercent: "20% 절약",
    currentPlan: "현재 플랜",
    upgrade: "지금 업그레이드",
    getStarted: "시작하기",
    contact: "영업팀에 문의"
  },

  // Terms and Privacy Pages
  legal: {
    termsTitle: "서비스 약관",
    privacyTitle: "개인정보 보호정책",
    lastUpdated: "마지막 업데이트",
    introduction: {
      title: "소개",
      description: "서비스를 사용하기 전에 이 약관을 주의 깊게 읽어 주세요."
    },
    dataUse: {
      title: "데이터 사용 방법",
      description: "저희는 귀하가 요청한 서비스를 제공하기 위해 파일을 처리합니다. 모든 파일은 24시간 후 자동으로 삭제됩니다."
    },
    cookies: {
      title: "쿠키 및 추적",
      description: "저희는 귀하의 경험을 개선하고 웹사이트 트래픽을 분석하기 위해 쿠키를 사용합니다."
    },
    rights: {
      title: "귀하의 권리",
      description: "귀하는 개인 정보에 접근하고, 수정하거나 삭제할 권리가 있습니다."
    }
  },

  // Error Pages
  error: {
    notFound: "페이지를 찾을 수 없습니다",
    notFoundDesc: "죄송합니다. 찾으시는 페이지를 찾을 수 없습니다.",
    serverError: "서버 오류",
    serverErrorDesc: "죄송합니다. 서버에서 문제가 발생했습니다. 나중에 다시 시도해 주세요.",
    goHome: "홈으로 가기",
    tryAgain: "다시 시도"
  },
  universalCompressor: {
    title: "유니버설 파일 압축기",
    description: "PDF, 이미지, 오피스 문서를 품질을 유지하면서 압축하세요",
    dropHereDesc: "여기에 파일을 드래그 앤 드롭하세요 (PDF, JPG, PNG, DOCX, PPTX, XLSX)",
    filesToCompress: "압축할 파일",
    compressAll: "모든 파일 압축",
    results: {
      title: "압축 결과",
      downloadAll: "모든 압축 파일 다운로드"
    },
    fileTypes: {
      pdf: "PDF 문서",
      image: "이미지",
      office: "오피스 문서",
      unknown: "알 수 없는 파일"
    },
    howTo: {
      title: "파일 압축 방법",
      step1: {
        title: "파일 업로드",
        description: "압축하고 싶은 파일을 업로드하세요"
      },
      step2: {
        title: "품질 선택",
        description: "원하는 압축 수준을 선택하세요"
      },
      step3: {
        title: "다운로드",
        description: "압축을 클릭하고 압축된 파일을 다운로드하세요"
      }
    },
    faq: {
      compressionRate: {
        question: "파일을 얼마나 압축할 수 있나요?",
        answer: "압축률은 파일 유형과 내용에 따라 다릅니다. PDF는 보통 20-70%, 이미지는 30-80%, 오피스 문서는 10-50% 압축됩니다."
      },
      quality: {
        question: "압축이 파일 품질에 영향을 미치나요?",
        answer: "저희 압축 알고리즘은 크기 감소와 품질 유지를 균형 있게 조정합니다. '높은 품질' 설정은 거의 동일한 시각적 품질을 유지합니다."
      },
      sizeLimit: {
        question: "파일 크기 제한이 있나요?",
        answer: "네, 파일당 최대 100MB까지 압축할 수 있습니다."
      }
    }
  },
  imageTools: {
    title: "이미지 도구",
    description: "이미지를 변환, 편집, 변형하기 위한 무료 온라인 도구",
    categories: {
      conversion: "형식 변환",
      editing: "이미지 편집",
      enhancement: "이미지 개선",
      optimization: "최적화",
      advanced: "고급 도구"
    },
    compressPng: {
      title: "PNG 압축",
      description: "품질을 유지하면서 PNG 파일 크기를 줄임",
      metaTitle: "PNG 이미지 압축 | 이미지 도구",
      metaDescription: "웹사이트 로딩 속도를 높이고 효율적인 저장을 위해 품질을 유지하면서 PNG 파일 크기를 줄임",
      metaKeywords: "PNG 압축, 이미지 크기 줄이기, 이미지 최적화, 이미지 압축, 무손실 압축, 파일 크기 감소"
    },
    makeTransparent: {
      title: "PNG 투명화",
      description: "PNG 파일 내의 임의의 색상을 투명으로 대체",
      metaTitle: "PNG 투명화 | 이미지 도구",
      metaDescription: "PNG 파일 내의 임의의 색상을 빠르게 투명으로 대체",
      metaKeywords: "배경 제거, 투명 PNG, 색상 대체, 이미지 편집, 배경 제거, 투명 이미지"
    },
    pngToJpg: {
      title: "PNG를 JPG로 변환",
      description: "사용자 정의 가능한 품질 설정으로 PNG 이미지를 JPG 형식으로 변환",
      metaTitle: "PNG를 JPG로 변환 | 이미지 도구",
      metaDescription: "조정 가능한 품질로 PNG 이미지를 JPG 형식으로 변환",
      metaKeywords: "PNG에서 JPG로, 이미지 변환, 이미지 형식, 손실 압축, 이미지 품질"
    },
    jpgToPng: {
      title: "JPG를 PNG로 변환",
      description: "투명도를 지원하여 JPG 이미지를 PNG 형식으로 변환",
      metaTitle: "JPG를 PNG로 변환 | 이미지 도구",
      metaDescription: "무손실 품질로 JPG 이미지를 PNG 형식으로 변환",
      metaKeywords: "JPG에서 PNG로, 이미지 변환, 투명도, 무손실 형식, 이미지 품질"
    },
    pngToWebp: {
      title: "PNG를 WebP로 변환",
      description: "웹 성능 향상을 위해 PNG 이미지를 WebP 형식으로 변환",
      metaTitle: "PNG를 WebP로 변환 | 이미지 도구",
      metaDescription: "파일 크기를 줄이기 위해 PNG 이미지를 WebP 형식으로 변환",
      metaKeywords: "PNG에서 WebP로, 이미지 변환, 웹 최적화, 이미지 압축"
    },
    webpToPng: {
      title: "WebP를 PNG로 변환",
      description: "호환성 향상을 위해 WebP 이미지를 PNG 형식으로 변환",
      metaTitle: "WebP를 PNG로 변환 | 이미지 도구",
      metaDescription: "완전한 호환성으로 WebP 이미지를 PNG 형식으로 변환",
      metaKeywords: "WebP에서 PNG로, 이미지 변환, 이미지 형식, 호환성"
    },
    svgToPng: {
      title: "SVG를 PNG로 변환",
      description: "벡터 SVG 파일을 래스터 PNG 이미지로 변환",
      metaTitle: "SVG를 PNG로 변환 | 이미지 도구",
      metaDescription: "사용자 정의 치수로 벡터 SVG 그래픽을 래스터 PNG 이미지로 변환",
      metaKeywords: "SVG에서 PNG로, 벡터에서 래스터로, 이미지 변환, 그래픽 디자인"
    },
    pngToBase64: {
      title: "PNG를 Base64로 변환",
      description: "웹 페이지에 삽입하기 위해 PNG 이미지를 Base64 인코딩으로 변환",
      metaTitle: "PNG를 Base64로 변환 | 이미지 도구",
      metaDescription: "웹 삽입용으로 PNG 이미지를 Base64 문자열로 변환",
      metaKeywords: "PNG에서 Base64로, 이미지 인코딩, 웹 개발, 이미지 삽입"
    },
    base64ToPng: {
      title: "Base64를 PNG로 변환",
      description: "Base64로 인코딩된 이미지 문자열을 PNG 파일로 재변환",
      metaTitle: "Base64를 PNG로 변환 | 이미지 도구",
      metaDescription: "Base64 이미지 문자열을 PNG 이미지 파일로 재변환",
      metaKeywords: "Base64에서 PNG로, 이미지 디코딩, 웹 개발, 이미지 변환"
    },
    changeColors: {
      title: "PNG 색상 변경",
      description: "PNG 이미지 내의 특정 색상을 새로운 색상으로 대체",
      metaTitle: "PNG 색상 변경 | 이미지 도구",
      metaDescription: "PNG 이미지 내의 특정 색상을 쉽게 새로운 색상으로 대체",
      metaKeywords: "이미지 색상 변경, 색상 대체, PNG 편집, 이미지 색상 변경기, 색상 교환"
    },
    changeTone: {
      title: "색조 변경",
      description: "예술적 효과를 위해 이미지에 색조와 톤을 적용",
      metaTitle: "PNG 색조 변경 | 이미지 도구",
      metaDescription: "예술적 효과를 위해 PNG 이미지에 색조와 톤을 적용",
      metaKeywords: "색조, 이미지 톤 조정, 예술적 효과, 색상 오버레이, 사진 필터"
    },
    addNoise: {
      title: "PNG에 노이즈 추가",
      description: "예술적 스타일을 위해 PNG 이미지에 필름 그레인 또는 노이즈 효과 추가",
      metaTitle: "PNG에 노이즈 추가 | 이미지 도구",
      metaDescription: "예술적 스타일을 위해 PNG 이미지에 필름 그레인 또는 노이즈 효과 추가",
      metaKeywords: "노이즈 추가, 필름 그레인, 이미지 텍스처, 예술적 필터, 빈티지 사진 효과"
    },
    resize: {
      title: "이미지 크기 조정",
      description: "품질을 유지하면서 이미지를 정확한 치수로 크기 조정",
      metaTitle: "이미지 크기 조정 | 이미지 도구",
      metaDescription: "품질을 유지하면서 이미지를 정확한 치수로 쉽게 크기 조정",
      metaKeywords: "이미지 크기 조정, 이미지 크기 변경, 이미지 스케일, 이미지 치수, 이미지 크기 조정"
    },
    rotate: {
      title: "회전 및 뒤집기",
      description: "올바른 방향을 위해 이미지를 회전 및 뒤집기",
      metaTitle: "이미지 회전 및 뒤집기 | 이미지 도구",
      metaDescription: "이미지를 원하는 각도로 쉽게 회전하고 수평 또는 수직으로 뒤집기",
      metaKeywords: "이미지 회전, 이미지 뒤집기, 이미지 방향, 이미지 돌리기, 수직 뒤집기"
    },
    crop: {
      title: "이미지 자르기",
      description: "불필요한 영역을 제거하고 중요한 콘텐츠에 초점을 맞추기 위해 이미지 자르기",
      metaTitle: "이미지 자르기 | 이미지 도구",
      metaDescription: "구성을 개선하기 위해 불필요한 영역을 제거하며 이미지 자르기",
      metaKeywords: "이미지 자르기, 이미지 트리밍, 배경 제거, 이미지 구성"
    },
    addText: {
      title: "이미지에 텍스트 추가",
      description: "사용자 정의 텍스트, 캡션 또는 워터마크를 이미지에 추가",
      metaTitle: "이미지에 텍스트 추가 | 이미지 도구",
      metaDescription: "간단한 서식 옵션으로 사용자 정의 텍스트, 캡션, 워터마크를 이미지에 추가",
      metaKeywords: "이미지에 텍스트 추가, 이미지 캡션, 워터마크, 텍스트 오버레이, 이미지 주석"
    },
    addBorder: {
      title: "테두리 추가",
      description: "다양한 스타일과 색상으로 사용자 정의 테두리를 이미지에 추가",
      metaTitle: "이미지에 테두리 추가 | 이미지 도구",
      metaDescription: "사용자 정의 테두리, 프레임, 효과로 이미지를 개선",
      metaKeywords: "이미지 테두리 추가, 포토 프레임, 이미지 프레이밍, 테두리 스타일, 이미지 개선"
    },
    addWatermark: {
      title: "워터마크 추가",
      description: "사진을 보호하기 위해 텍스트 또는 이미지 워터마크 추가",
      metaTitle: "이미지에 워터마크 추가 | 이미지 도구",
      metaDescription: "이미지를 보호하고 브랜드화하기 위해 텍스트 또는 이미지 워터마크 추가",
      metaKeywords: "워터마크 추가, 이미지 보호, 브랜딩, 저작권, 이미지 보안"
    }
  },
  repairPdf: {
    title: "PDF 파일 복구",
    description: "손상된 PDF 파일을 복구하고, 콘텐츠를 복원하며, 문서 구조를 최적화합니다",
    howTo: {
      title: "PDF를 복구하는 방법",
      step1: {
        title: "PDF 업로드",
        description: "기기에서 복구하려는 PDF 파일을 선택하세요"
      },
      step2: {
        title: "복구 모드 선택",
        description: "파일 문제에 따라 적절한 복구 방법을 선택하세요"
      },
      step3: {
        title: "복구된 PDF 다운로드",
        description: "구조와 콘텐츠가 수정된 복구된 PDF 파일을 다운로드하세요"
      }
    },
    why: {
      title: "왜 PDF를 복구하나요",
      corruptedFiles: {
        title: "손상된 파일 복구",
        description: "정상적으로 열리지 않는 손상된 PDF 파일에서 콘텐츠와 구조를 복원합니다"
      },
      missingContent: {
        title: "누락된 콘텐츠 복원",
        description: "부분적으로 손상된 문서에서 누락된 이미지, 텍스트 또는 페이지를 복원합니다"
      },
      documentStructure: {
        title: "문서 구조 복구",
        description: "손상된 내부 구조, 페이지 참조 및 링크를 복구합니다"
      },
      fileSize: {
        title: "파일 크기 최적화",
        description: "불필요한 데이터를 정리하고 품질 손실 없이 파일 크기를 최적화합니다"
      }
    },
    modes: {
      title: "사용 가능한 복구 모드",
      standard: {
        title: "표준 복구",
        description: "일반적인 PDF 문제를 수정합니다. 깨진 교차 참조, 잘못된 객체, 스트림 오류를 포함합니다. 여전히 열리지만 오류를 표시하는 약간 손상된 PDF에最適입니다."
      },
      advanced: {
        title: "고급 복원",
        description: "심각한 구조적 문제가 있는 심하게 손상된 PDF를 위한 심층 복구입니다. 전혀 열리지 않는 파일에서 가능한 한 많은 콘텐츠를 복원합니다."
      },
      optimization: {
        title: "최적화",
        description: "콘텐츠 손실 없이 PDF 파일을 재구성하고 최적화합니다. 중복 데이터를 제거하고, 사소한 문제를 수정하며, 전체 파일 구조를 개선합니다."
      }
    },
    faq: {
      title: "자주 묻는 질문",
      whatCanRepair: {
        question: "어떤 종류의 PDF 문제를 수정할 수 있나요?",
        answer: "저희 복구 도구는 손상된 파일 구조, 깨진 페이지 참조, 손상된 콘텐츠 스트림, 누락된 교차 참조 테이블, 유효하지 않은 객체 등 다양한 문제를 해결할 수 있습니다. 표준 PDF 뷰어에서 열리지 않거나 제대로 표시되지 않는 PDF에서 콘텐츠를 복원할 수 있는 경우가 많습니다."
      },
      completelyDamaged: {
        question: "완전히 손상된 PDF를 복구할 수 있나요?",
        answer: "저희 고급 복구 모드는 심하게 손상된 PDF에서 콘텐츠를 복원할 수 있지만, 파일이 완전히 손상된 경우 100% 복원은 항상 가능한 것은 아닙니다. 그러나 극단적인 경우에도 텍스트나 기본 요소와 같은 부분적인 콘텐츠를 복원할 수 있는 경우가 많습니다."
      },
      contentQuality: {
        question: "복구가 콘텐츠 품질에 영향을 미치나요?",
        answer: "아니요, 저희 복구 프로세스는 복원 가능한 콘텐츠의 품질을 유지합니다. PDF를 단순히 추출하고 재생성하는 일부 도구(포맷이 손실될 수 있음)와 달리, 손상된 부분만 수정하면서 원래 구조를 보존하려고 노력합니다."
      },
      passwordProtected: {
        question: "비밀번호로 보호된 PDF를 복구할 수 있나요?",
        answer: "네, 비밀번호가 있으면 비밀번호로 보호된 PDF를 복구할 수 있습니다. 복구 과정에서 비밀번호를 입력해야 합니다. 그러나 적절한 권한 없이 보호된 문서의 암호화를 우회하거나 제거하려는 시도는 하지 않습니다."
      },
      dataSecurity: {
        question: "복구 과정에서 PDF 데이터가 안전한가요?",
        answer: "네, 저희는 데이터 보안을 매우 중요하게 생각합니다. 귀하의 파일은 저희 서버에서 안전하게 처리되며, 제3자와 공유되지 않고 처리 후 자동으로 삭제됩니다. 모든 파일 전송에 암호화를 사용하며, 전체 복구 프로세스는 안전한 환경에서 진행됩니다."
      }
    },
    bestPractices: {
      title: "PDF 복원을 위한 최상의 실천 방법",
      dos: "해야 할 일",
      donts: "하지 말아야 할 일",
      dosList: [
        "복구를 시도하기 전에 원본 파일의 백업을 유지하세요",
        "고급 복원 모드를 사용하기 전에 먼저 표준 복구 모드를 시도하세요",
        "가능하면 여러 뷰어로 PDF를 확인하세요",
        "복구 전에 문제가 있는 페이지나 요소를 기록하세요",
        "크지만 기능하는 PDF에는 최적화 모드를 사용하세요"
      ],
      dontsList: [
        "손상된 PDF를 반복적으로 저장하지 마세요. 손상이 악화될 수 있습니다",
        "올바른 PDF 생성 대신 복구를 사용하지 마세요",
        "심하게 손상된 파일에서 100% 복원을 기대하지 마세요",
        "복구된 파일을 오래된 PDF 뷰어에서 열지 마세요. 다시 손상될 수 있습니다",
        "복구된 파일의 콘텐츠 정확성을 확인하는 것을 건너뛰지 마세요"
      ]
    },
    relatedTools: {
      title: "관련 도구",
      compress: "PDF 압축",
      unlock: "PDF 잠금 해제",
      protect: "PDF 보호",
      edit: "PDF 편집",
      viewAll: "모든 도구 보기"
    },
    form: {
      title: "PDF 복구 도구",
      description: "손상된 PDF를 복구하고, 콘텐츠를 복원하며, 문서 구조를 최적화합니다",
      upload: "복구를 위해 PDF 업로드",
      dragDrop: "여기에 PDF 파일을 끌어다 놓거나, 클릭하여 찾아보세요",
      selectFile: "PDF 파일 선택",
      maxFileSize: "최대 파일 크기: 100MB",
      change: "파일 변경",
      repairModes: "복구 모드",
      standardRepair: "표준 복구",
      standardDesc: "깨진 링크나 구조적 문제와 같은 일반적인 문제를 수정합니다",
      advancedRecovery: "고급 복원",
      advancedDesc: "심하게 손상되거나 손상된 PDF 파일을 위한 심층 복원",
      optimization: "최적화",
      optimizationDesc: "콘텐츠 손실 없이 PDF 구조를 정리하고 최적화합니다",
      advancedOptions: "고급 옵션",
      showOptions: "옵션 표시",
      hideOptions: "옵션 숨기기",
      preserveFormFields: "양식 필드 보존",
      preserveFormFieldsDesc: "가능하면 인터랙티브 양식 필드를 유지합니다",
      preserveAnnotations: "주석 보존",
      preserveAnnotationsDesc: "댓글, 하이라이트 및 기타 주석을 유지합니다",
      preserveBookmarks: "북마크 보존",
      preserveBookmarksDesc: "문서 개요와 북마크를 유지합니다",
      optimizeImages: "이미지 최적화",
      optimizeImagesDesc: "파일 크기를 줄이기 위해 이미지를 다시 압축합니다",
      password: "PDF 비밀번호",
      passwordDesc: "이 PDF는 비밀번호로 보호되어 있습니다. 복구하려면 비밀번호를 입력하세요.",
      repair: "PDF 복구",
      repairing: "PDF 복구 중...",
      security: "귀하의 파일은 안전하게 처리됩니다. 모든 업로드는 처리 후 자동으로 삭제됩니다.",
      analyzing: "PDF 구조 분석 중",
      rebuilding: "문서 구조 재구성 중",
      recovering: "콘텐츠 복원 중",
      fixing: "교차 참조 수정 중",
      optimizing: "파일 최적화 중",
      finishing: "마무리 중"
    },
    results: {
      success: "PDF가 성공적으로 복구되었습니다",
      successMessage: "귀하의 PDF가 복구되었으며 다운로드할 준비가 되었습니다.",
      issues: "복구 문제 감지됨",
      issuesMessage: "귀하의 PDF를 복구하는 동안 문제가 발생했습니다. 일부 콘텐츠는 복원되지 않을 수 있습니다.",
      details: "복구 세부 정보",
      fixed: "수정된 문제",
      warnings: "경고",
      fileSize: "파일 크기",
      original: "원본",
      new: "새로운",
      reduction: "감소",
      download: "복구된 PDF 다운로드",
      repairAnother: "다른 PDF 복구"
    }
  },
  faq: {
    categories: {
      general: "일반",
      conversion: "변환",
      security: "보안",
      account: "계정",
      api: "API"
    },
    general: {
      question1: "ScanPro란 무엇인가요?",
      answer1: "ScanPro는 PDF 관리 및 변환을 위한 포괄적인 온라인 플랫폼입니다. 저희 도구는 직관적인 웹 인터페이스 또는 API를 통해 PDF 문서를 변환, 편집, 병합, 분할, 압축, 보안 설정하는 데 도움을 줍니다.",
      question2: "ScanPro를 사용하려면 계정을 만들어야 하나요?",
      answer2: "아니요, 등록 없이 기본 PDF 도구를 사용할 수 있습니다. 하지만 무료 계정을 만들면 기록 저장, 더 높은 파일 크기 제한, 추가 기능에 대한 접근과 같은 혜택을 누릴 수 있습니다.",
      question3: "ScanPro에서 제 데이터는 안전한가요?",
      answer3: "네, 모든 파일은 암호화된 서버에서 안전하게 처리됩니다. 귀하의 파일은 제3자와 공유되지 않으며, 처리 후 24시간 이내에 서버에서 자동으로 삭제됩니다. 자세한 내용은 개인정보 보호정책을 참조하세요.",
      question4: "ScanPro는 어떤 기기와 브라우저를 지원하나요?",
      answer4: "ScanPro는 Chrome, Firefox, Safari, Edge를 포함한 모든 최신 브라우저에서 작동합니다. 플랫폼은 완전히 반응형이며 데스크톱, 태블릿, 모바일 기기에서 사용 가능합니다."
    },
    conversion: {
      question1: "어떤 파일 형식을 변환할 수 있나요?",
      answer1: "ScanPro는 PDF를 Word(DOCX), Excel(XLSX), PowerPoint(PPTX), 이미지(JPG, PNG), HTML, 일반 텍스트 등 다양한 형식으로 변환할 수 있습니다. 이러한 형식을 다시 PDF로 변환할 수도 있습니다.",
      question2: "PDF 변환의 정확도는 어느 정도인가요?",
      answer2: "저희 변환 엔진은 글꼴, 이미지, 표, 레이아웃을 포함한 형식을 유지하기 위해 고급 알고리즘을 사용합니다. 하지만 매우 복잡한 문서의 경우 약간의 형식 차이가 있을 수 있습니다. 최상의 결과를 위해 복잡한 형식의 문서에는 'PDF to Word' 또는 'PDF to Excel' 도구를 사용하는 것을 권장합니다.",
      question3: "변환에 파일 크기 제한이 있나요?",
      answer3: "무료 사용자는 최대 10MB 파일을 변환할 수 있습니다. 베이직 구독자는 50MB, 프로 구독자는 100MB, 엔터프라이즈 사용자는 500MB까지 가능합니다. 더 큰 파일을 처리해야 하는 경우 맞춤형 솔루션을 위해 문의해 주세요.",
      question4: "왜 제 PDF 변환이 실패했나요?",
      answer4: "파일이 손상되었거나, 비밀번호로 보호되어 있거나, 시스템이 처리할 수 없는 복잡한 요소가 포함된 경우 변환이 실패할 수 있습니다. 먼저 'PDF 복구' 도구를 사용한 후 다시 시도해 보세요. 문제가 지속되면 '고급' 변환 모드를 사용하거나 지원팀에 연락하세요."
    },
    security: {
      question1: "PDF에 비밀번호를 어떻게 설정하나요?",
      answer1: "'PDF 보호' 도구를 사용하세요. PDF를 업로드하고, 비밀번호를 설정하며, 원하는 경우 권한 제한을 선택한 후 'PDF 보호'를 클릭하세요. 사용자가 인쇄, 편집, 콘텐츠 복사를 할 수 있는지 여부를 제어할 수 있습니다.",
      question2: "PDF에서 비밀번호를 제거할 수 있나요?",
      answer2: "네, 'PDF 잠금 해제' 도구를 사용하세요. 보호를 해제하려면 현재 비밀번호를 입력해야 합니다. 저희는 귀하가 소유하거나 수정 권한이 있는 문서에서만 비밀번호 보호를 제거하는 데 도움을 줍니다.",
      question3: "PDF 보호에 어떤 암호화 수준을 사용하나요?",
      answer3: "저희는 PDF 보호에 업계 표준 256비트 AES 암호화를 사용하여 문서에 강력한 보안을 제공합니다. 오래된 PDF 리더와의 호환성이 필요한 경우 128비트 암호화도 지원합니다."
    },
    account: {
      question1: "구독을 어떻게 업그레이드하나요?",
      answer1: "계정에 로그인하고 대시보드로 이동하여 '구독' 탭을 선택하세요. 귀하의 필요에 맞는 플랜을 선택하고 결제 지침을 따르세요. 결제 후 새로운 기능이 즉시 활성화됩니다.",
      question2: "구독을 취소할 수 있나요?",
      answer2: "네, 대시보드의 '구독' 탭에서 언제든지 구독을 취소할 수 있습니다. 현재 결제 기간이 끝날 때까지 프리미엄 기능에 계속 접근할 수 있습니다.",
      question3: "비밀번호를 어떻게 재설정하나요?",
      answer3: "로그인 페이지에서 '비밀번호를 잊으셨나요?'를 클릭하고 이메일 주소를 입력하세요. 1시간 동안 유효한 비밀번호 재설정 링크를 보내드립니다. 이메일을 받지 못한 경우 스팸 폴더를 확인하거나 지원팀에 연락하세요."
    },
    api: {
      question1: "API 키는 어떻게 얻나요?",
      answer1: "계정을 등록한 후 대시보드 > API 키로 이동하여 첫 번째 API 키를 생성하세요. 무료 계정은 1개, 베이직 구독자는 3개, 프로 구독자는 10개, 엔터프라이즈 사용자는 50개 이상의 키를 받을 수 있습니다.",
      question2: "API 속도 제한은 무엇인가요?",
      answer2: "속도 제한은 구독 등급에 따라 다릅니다: 무료(10 요청/시간), 베이직(100 요청/시간), 프로(1,000 요청/시간), 엔터프라이즈(5,000+ 요청/시간). 각 등급에 월간 운영 제한도 적용됩니다.",
      question3: "API를 제 애플리케이션에 어떻게 통합하나요?",
      answer3: "저희 API는 JSON 응답을 사용하는 표준 REST 엔드포인트를 사용합니다. 개발자 섹션에서 포괄적인 문서, 코드 샘플, SDK를 찾을 수 있습니다. JavaScript, Python, PHP, Java 등 다양한 프로그래밍 언어에 대한 예제를 제공합니다."
    },
    title: "자주 묻는 질문"
  }
}