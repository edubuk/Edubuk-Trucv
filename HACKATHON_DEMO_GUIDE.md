# TruCV - Hackathon Demo Guide

TruCV turns a traditional CV into a portable, verifiable professional identity. Candidates can create a new CV through a guided form or import an existing resume for AI-assisted structuring. Supporting documents for education, work experience, and certificates can be submitted to their issuing authorities for review. The issuer's approval or rejection is recorded onchain, allowing the candidate to reuse verified credentials in future applications.

## Important Security Notice

> **Never commit a production wallet private key, seed phrase, API key, or reusable personal credential to GitHub.**
>
> The issuer key below must belong to a disposable **Sepolia-only demo wallet** that contains no mainnet assets, tokens, or permissions. Fund it only with the minimum Sepolia ETH needed for judging. Assume that anything committed to a public repository is permanently public, even if it is later removed. Rotate or abandon the demo wallet after the hackathon.

## Quick Links

| Resource | Link |
| --- | --- |
| Live TruCV demo | [https://trucv-hackathon.edubuk.com](https://trucv-hackathon.edubuk.com) |
| Demo video | `<ADD_DEMO_VIDEO_URL>` |
| Frontend repository | [https://github.com/edubuk/Edubuk-Trucv](https://github.com/edubuk/Edubuk-Trucv) |
| Backend repository | `<ADD_BACKEND_REPOSITORY_URL>` |
| Smart-contract repository | `<ADD_SMART_CONTRACT_REPOSITORY_URL>` |
| Sepolia contract | [0x27Ca78A18e8C23Aa116C89D9e85eD9f61474afC0](https://sepolia.etherscan.io/address/0x27Ca78A18e8C23Aa116C89D9e85eD9f61474afC0) |

## Demo Access

Replace every placeholder before submitting the repository. Use accounts created exclusively for hackathon judging.

### Candidate account

```text
Login URL: https://trucv-hackathon.edubuk.com/login
Email: <CANDIDATE_DEMO_EMAIL>
Password: <CANDIDATE_DEMO_PASSWORD>
```

This account should contain a sample CV and at least one credential ready to send for issuer verification.

### Issuer account or verification inbox

The issuer receives the candidate's verification request through the email address entered by the candidate. If the issuer also needs application credentials, add them here.

```text
Issuer email/inbox: <ISSUER_DEMO_EMAIL>
Issuer email password or inbox access instructions: <ISSUER_INBOX_ACCESS>
Issuer application password, if applicable: <ISSUER_APP_PASSWORD_OR_NOT_REQUIRED>
```

### Administrator account

The administrator manages trusted issuer wallets. Judges do not need to repeat the whitelist transaction when using the pre-whitelisted issuer wallet below.

```text
Admin login URL: https://trucv-hackathon.edubuk.com/login
Email: <ADMIN_DEMO_EMAIL>
Password: <ADMIN_DEMO_PASSWORD>
```

## Pre-whitelisted Issuer Wallet

Use a disposable wallet created only for this Sepolia demo. Verify that its address is already present in the TruCV issuer list before publishing this guide.

```text
Network: Ethereum Sepolia
Chain ID: 11155111
Contract: 0x27Ca78A18e8C23Aa116C89D9e85eD9f61474afC0
Issuer wallet address: <PRE_WHITELISTED_ISSUER_WALLET_ADDRESS>
Disposable Sepolia-only private key: <DISPOSABLE_SEPOLIA_PRIVATE_KEY>
```

### Import the issuer wallet into MetaMask

1. Open MetaMask and select **Add account or hardware wallet**.
2. Choose **Import account**.
3. Paste the disposable Sepolia private key above.
4. Enable test networks and switch to **Sepolia**.
5. Confirm that the imported address matches the documented issuer wallet address.
6. Open the verification link from the issuer email and connect this wallet.

Do not add a seed phrase to this guide. A private key for one isolated test account limits exposure compared with publishing a recovery phrase that may control multiple accounts.

## Roles and Responsibilities

### Candidate

The candidate owns and manages their TruCV.

- Creates a fresh CV by completing the guided form, or imports an existing resume for AI-assisted parsing and professional formatting.
- Adds personal details, education, work experience, skills, projects, awards, and certificates.
- Uploads supporting evidence for individual credentials.
- Selects a credential and sends its details and document to the appropriate issuing authority through the Edubuk verification email workflow.
- Tracks whether each credential is pending, verified, or rejected.
- Shares the completed TruCV using a public link, QR code, or ATS-friendly printable template.
- Reuses verified credentials in future applications without repeating the full verification process.

### Issuer

The issuer is the university, employer, certification body, or another authorized representative responsible for validating a claim.

- Opens the secure verification link received by email.
- Reviews the candidate's submitted information and supporting document.
- Connects an admin-whitelisted issuer wallet.
- Approves a valid credential or rejects an incorrect credential with an appropriate reason.
- Signs the blockchain transaction that records the decision permanently.

An issuer cannot verify credentials unless its wallet has first been whitelisted by the TruCV administrator.

### Administrator

The administrator maintains the trusted issuer network.

- Reviews the identity and authority of an issuer before granting access.
- Connects the contract-owner/admin wallet.
- Whitelists an issuer's wallet address and associates it with the issuer's name.
- Can revoke an issuer that should no longer have verification authority.
- Monitors registered issuers and verification activity.

For this hackathon demo, the supplied disposable issuer wallet is already whitelisted, so judges can test approval or rejection without requiring an administrator transaction.

## End-to-End Judge Walkthrough

### 1. Review or create the candidate's TruCV

1. Open the live demo and sign in with the candidate credentials.
2. Open **My CV** from the dashboard.
3. Review the existing profile, or create/import a CV.
4. Add or select an education, experience, or certificate entry with a supporting document.

### 2. Send a credential for verification

1. Enter the demo issuer email address for the selected credential.
2. Submit the verification request.
3. Confirm that the credential shows a pending or in-progress status.
4. Open the verification email in the issuer inbox.

### 3. Act as the issuer

1. Import the disposable issuer wallet into MetaMask using the instructions above.
2. Switch MetaMask to Sepolia.
3. Open the secure verification link from the email.
4. Review the candidate data and supporting document.
5. Connect the imported issuer wallet.
6. Approve the credential, or reject it to test the alternate workflow.
7. Confirm the transaction in MetaMask and wait for confirmation.

### 4. Confirm the onchain result

1. Return to the candidate dashboard and refresh the credential status.
2. Confirm that the result now appears as verified or rejected.
3. Open the transaction on Sepolia Etherscan.
4. For an approval, open the candidate's public TruCV and confirm that the verified label appears beside the credential.
5. Scan the CV's QR code or print/save an ATS-friendly template to test the sharing experience.

### Optional: demonstrate the administrator flow

1. Sign in with the administrator account.
2. Open the issuer-management section.
3. Show the registered issuer list and the pre-whitelisted demo wallet.
4. If desired, whitelist a second disposable Sepolia wallet to demonstrate the admin transaction.
5. Do not revoke the primary demo issuer wallet until judging is complete.

## What Is Recorded Onchain?

TruCV records cryptographic document references, candidate submissions, issuer decisions, timestamps, and verification status through the Sepolia smart contract. Raw CV files and private supporting documents are not written directly to the blockchain. Documents are stored separately, while their hashes and verification records provide tamper-evident proof.

## Suggested Demo Scenarios

### Successful verification

- Candidate submits a genuine graduation certificate.
- Pre-whitelisted university wallet reviews and approves it.
- Candidate's TruCV displays the credential as verified.
- Judge confirms the transaction and contract event on Sepolia Etherscan.

### Rejected credential

- Candidate submits a second sample credential containing an intentional mismatch.
- Issuer rejects it and provides a reason.
- Candidate dashboard displays the rejected status and reason.
- Judge confirms that the issuer action was recorded onchain.

## Screenshots

Add the final screenshots under `docs/screenshots/` and replace the placeholders below.

### Homepage

![TruCV homepage](docs/screenshots/01-homepage.png)

### Candidate dashboard and CV templates

![Candidate dashboard](docs/screenshots/02-candidate-dashboard.png)

![TruCV templates](docs/screenshots/03-cv-templates.png)

### Credential submission

![Candidate submits a credential](docs/screenshots/04-credential-submission.png)

### Issuer review

![Issuer verification screen](docs/screenshots/05-issuer-review.png)

### Admin issuer whitelist

![Admin issuer-management screen](docs/screenshots/06-admin-whitelist.png)

### Verified credential and blockchain transaction

![Verified credential](docs/screenshots/07-verified-credential.png)

![Sepolia transaction](docs/screenshots/08-sepolia-transaction.png)

## Architecture Summary

```text
Candidate
   |
   | creates/imports CV and submits credential evidence
   v
TruCV application + secure document storage
   |
   | sends a review link through the issuer email workflow
   v
Whitelisted Issuer Wallet
   |
   | approves or rejects the credential
   v
Sepolia Smart Contract
   |
   | emits an auditable verification record
   v
Candidate's shareable and verifiable TruCV

Admin -> validates issuer identity -> whitelists/revokes issuer wallet
```

## Pre-submission Checklist

- [ ] Replace every `<PLACEHOLDER>` value.
- [ ] Confirm all demo links are publicly accessible.
- [ ] Test candidate and administrator credentials in an incognito window.
- [ ] Confirm the issuer email inbox is accessible to judges.
- [ ] Confirm the demo issuer wallet is already whitelisted.
- [ ] Confirm the wallet contains only minimal Sepolia ETH and no valuable assets.
- [ ] Confirm the private key controls only the disposable test account.
- [ ] Complete both approval and rejection test runs.
- [ ] Verify transactions and emitted events on Sepolia Etherscan.
- [ ] Add and preview every screenshot.
- [ ] Replace or remove demo credentials and abandon the published wallet after judging.

## Support During Judging

```text
Contact name: <CONTACT_NAME>
Email: <SUPPORT_EMAIL>
Telegram/Discord: <OPTIONAL_SUPPORT_HANDLE>
```

