# API Typescript Domaine Driven Design

##

[![typescript](assets/made-with-typescript.svg)](https://www.typescriptlang.org)\
[![typescript](assets/made-with-domaine-driven-design.svg)](https://blog.octo.com/architecture-hexagonale-trois-principes-et-un-exemple-dimplementation)

##
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1c2a7ab5fd8b48b29afaba4e7bcec8c6)](https://www.codacy.com/gh/rhannachi/api-ddd/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rhannachi/api-ddd&amp;utm_campaign=Badge_Grade)\
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/rhannachi/api-ddd.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/rhannachi/api-ddd/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/rhannachi/api-ddd.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/rhannachi/api-ddd/alerts/)
[![Known Vulnerabilities](https://snyk.io/test/github/rhannachi/api-ddd/badge.svg)](https://snyk.io/test/github/rhannachi/api-ddd)

[![Workflows (Lint, Test) Actions](https://github.com/rhannachi/api-ddd/actions/workflows/workflow.yml/badge.svg)](https://github.com/rhannachi/api-ddd/actions/workflows/workflow.yml)\
[![codecov](https://codecov.io/gh/rhannachi/api-ddd/branch/main/graph/badge.svg?token=0AE7QTRB6W)](https://codecov.io/gh/rhannachi/api-ddd)

## Architecture and dependencies:

```
src/
├── adapters
│   ├── emailValidation
│   │   └── emailValidator.adapter.ts
│   └── encrypter
│       └── encrypter.adapter.ts
├── application
│   ├── protocols
│   │   ├── addUser.repository.d.ts
│   │   ├── encrypter.adapter.d.ts
│   │   └── logError.repository.d.ts
│   └── user
│       └── addUser.ts
├── domain
│   ├── authentication
│   │   └── authentication.d.ts
│   └── user
│       └── user.d.ts
├── infra
│   └── mongo
│       ├── helper.ts
│       ├── log
│       │   ├── log.repository.model.ts
│       │   └── log.repository.ts
│       └── user
│           ├── user.repository.model.ts
│           └── user.repository.ts
├── main
│   ├── adapters
│   │   └── express.adapter.ts
│   ├── config
│   │   ├── app.ts
│   │   └── env.ts
│   ├── decorators
│   │   └── log.ts
│   ├── factories
│   │   ├── signin
│   │   │   ├── signin.ts
│   │   │   └── signinValidation.ts
│   │   └── signup
│   │       ├── signup.ts
│   │       └── signupValidation.ts
│   ├── middlewares
│   │   ├── bodyParser.ts
│   │   ├── contentType.ts
│   │   └── cors.ts
│   ├── routes
│   │   └── signup.route.ts
│   └── server.ts
└── presentation
    ├── controllers
    │   ├── http.ts
    │   ├── signin
    │   │   └── signin.ts
    │   └── signup
    │       └── signup.ts
    ├── errors
    │   ├── invalidParams.ts
    │   ├── missingParams.ts
    │   ├── serverError.ts
    │   └── unauthorized.ts
    ├── protocols
    │   ├── controller.d.ts
    │   ├── emailValidation.adapter.d.ts
    │   ├── fieldsValidation.d.ts
    │   └── http.d.ts
    └── validators
        ├── compareFieldsValidation.ts
        ├── emailValidation.ts
        ├── fieldsValidationComposite.ts
        └── requiredFieldValidation.ts
```

### Presentation layer

![Presentation Layer](/assets/dependencies-presentation.png)

### Application layer

![Application Layer](/assets/dependencies-application.png)

### Infra layer

![Infra Layer](/assets/dependencies-infra.png)

### Adapters layer

![Adapters Layer](/assets/dependencies-adapters.png)

### Main layer

![Main Layer](/assets/dependencies-main.png)
