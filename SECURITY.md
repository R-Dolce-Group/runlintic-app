# Security Policy

## Supported Versions

We actively support the following versions of Runlintic App with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 8.x.x   | :white_check_mark: |
| 7.x.x   | :white_check_mark: |
| < 7.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Runlintic App, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. **Email us directly** at: security@rdolcegroup.com
3. **Include the following information**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (if available)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 5 business days
- **Status Updates**: We will keep you informed of our progress
- **Resolution Timeline**: We aim to resolve critical vulnerabilities within 30 days

### Responsible Disclosure

We follow responsible disclosure practices:

- We will work with you to understand and resolve the issue
- We will credit you for the discovery (unless you prefer to remain anonymous)
- We ask that you do not publicly disclose the vulnerability until we have had a chance to address it

## Security Best Practices

When using Runlintic App, we recommend:

### For Users

- Always use the latest stable version
- Regularly run `npm audit` to check for vulnerabilities
- Use `npm run health-check` to validate your project security
- Keep your Node.js environment updated (we require Node.js >=22.16.0)

### For Contributors

- Run security checks before submitting PRs
- Follow our code review process
- Use conventional commits for security fixes: `fix(security): description`

## Security Features

Runlintic App includes several built-in security features:

### Dependency Security

- **Automated vulnerability scanning** with `npm audit`
- **Dependency overrides** for known vulnerable packages
- **Regular dependency updates** via Dependabot
- **Zero-tolerance** for security vulnerabilities in CI/CD

### Code Quality Security

- **ESLint rules** to prevent common security issues
- **TypeScript strict mode** for type safety
- **Input validation** in all CLI commands
- **Secure defaults** in all configurations

### Release Security

- **Signed releases** with GitHub Actions
- **Automated security checks** before releases
- **Immutable release artifacts** on npm registry
- **Provenance attestation** for supply chain security

## Security Auditing

We regularly perform:

- **Automated dependency scanning** (daily via Dependabot)
- **Code security analysis** (via CodeQL on every PR)
- **Manual security reviews** for major releases
- **Third-party security assessments** (annually)

## Security Contacts

- **General Security**: security@rdolcegroup.com
- **Maintainer**: @mj163 (GitHub)

## Acknowledgments

We thank the following security researchers for their responsible disclosure of vulnerabilities:

- [Your name could be here]

---

For more information about R. Dolce Group's security practices, visit: [https://rdolcegroup.com/security](https://rdolcegroup.com/security)
