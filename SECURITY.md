# 🛡️ Security Policy

Security is the highest priority for **StarryCrypt**. Because this project handles encryption and user privacy, we take potential vulnerabilities very seriously.

## Supported Versions

Currently, only the **latest version** on the default branch receives security updates. If you are using a fork or local copy, please pull the latest changes to ensure you have the most up-to-date security patches.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report suspected vulnerabilities by opening a private security advisory in **GitHub Security Advisories** for this repository. 

When reporting, please include:
- **Description**: A clear and detailed explanation of the vulnerability.
- **Reproduction Steps**: Exact steps (including browser and OS versions) required to reproduce the issue.
- **Impact Assessment**: What the potential impact is (e.g., plaintext leak, cross-site scripting).
- **Remediation**: Any suggested fixes or remediations, if you have them.

### Response Timeline
We aim to acknowledge receipt of vulnerability reports within 48 hours. Please do not disclose vulnerabilities publicly before maintainers confirm and release a fix.

## Out of Scope
Because StarryCrypt relies entirely on the browser's native **Web Crypto API**, vulnerabilities inherent to underlying browser implementations are outside the scope of this repository and should be reported to the respective browser vendors (e.g., Chromium, Mozilla, Apple).
