# Security Policy

## 🛡️ Security Overview

The R. Dolce Group takes the security of **runlintic-app** seriously. We appreciate your efforts to responsibly disclose your findings and will make every effort to acknowledge your contributions.

## 🔍 Supported Versions

Security updates are provided for the following versions:

| Version | Supported  | Status                              |
| ------- | ---------- | ----------------------------------- |
| 6.3.x   | ✅ Yes     | Active development, regular updates |
| 6.2.x   | ✅ Yes     | Security patches only               |
| 6.1.x   | ⚠️ Limited | Critical security issues only       |
| < 6.1   | ❌ No      | End of life - please upgrade        |

**Current Stable Version:** v6.3.13  
**Minimum Supported Version:** v6.1.0

## 🚨 Reporting Security Vulnerabilities

### 📧 **Private Disclosure (Recommended)**

For security vulnerabilities that could impact users, please report privately:

**Email:** [mj163@github.com](mailto:mj163@github.com)
**Subject:** `[SECURITY] runlintic-app vulnerability report`

**Include in your report:**

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact and severity assessment
- Suggested fix (if you have one)
- Your contact information for follow-up

### 🔒 **GitHub Security Advisory (Alternative)**

You can also report vulnerabilities through GitHub's security advisory system:

1. Go to: https://github.com/R-Dolce-Group/runlintic-app/security/advisories
2. Click "New draft security advisory"
3. Fill out the form with vulnerability details
4. Submit for private review

## ⚡ Response Timeline

We aim to respond to security reports within:

- **Initial acknowledgment:** 48 hours
- **Preliminary assessment:** 5 business days
- **Detailed response:** 10 business days
- **Security fix release:** 30 days (for confirmed vulnerabilities)

## 🎯 Vulnerability Scope

### ✅ **In Scope**

Security issues in:

- **Command injection** in commit generation scripts
- **Input validation** bypasses in CLI interfaces
- **Dependency vulnerabilities** in production dependencies
- **Unauthorized file system access** through configuration
- **Code execution** vulnerabilities in automated scripts
- **Secrets exposure** in logs, configuration, or output

### ❌ **Out of Scope**

The following are typically NOT considered security vulnerabilities:

- Issues in development-only dependencies
- Social engineering attacks against repository maintainers
- Physical access to development machines
- Issues requiring local file system write access
- Version disclosure in public package managers
- Rate limiting or DoS via npm install

## 🏆 Recognition

We believe in recognizing security researchers who help improve our security:

- **Public acknowledgment** in release notes (if desired)
- **Security researcher credit** in CHANGELOG.md
- **GitHub Security Advisory** co-author status
- **Priority support** for future security research

## 🔧 Security Best Practices

When using runlintic-app:

### ✅ **Do:**

- Keep runlintic-app updated to the latest version
- Review generated commit messages before execution
- Use the tool in trusted development environments
- Report suspicious behavior or unexpected outputs

### ❌ **Don't:**

- Run runlintic-app with elevated privileges unnecessarily
- Use in production environments without proper testing
- Ignore security warnings from Dependabot or CodeQL
- Execute generated scripts without review

## 🤝 Security Contact

**Primary Security Contact:** @mj163 (GitHub)  
**Secondary Contact:** @mrsdo (GitHub)  
**Organization:** R. Dolce Group

**PGP Key:** Available upon request for encrypted communications

## 📚 Additional Resources

- [GitHub Security Documentation](https://docs.github.com/en/code-security)
- [NPM Security Best Practices](https://docs.npmjs.com/security)
- [Node.js Security Guide](https://nodejs.org/en/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Last Updated:** September 6, 2025  
**Next Review:** December 2025

_This security policy is subject to updates. Subscribe to repository releases to stay informed of changes._
