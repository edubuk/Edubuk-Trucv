# TruCV - Hackathon Demo Guide

TruCV turns a traditional CV into a portable, verifiable professional identity. Candidates can create a new CV through a guided form or import an existing resume for AI-assisted structuring. Supporting documents for education, work experience, and certificates can be submitted to their issuing authorities for review. The issuer's approval or rejection is recorded onchain, allowing the candidate to reuse verified credentials in future applications.


## Quick Links

| Resource | Link |
| --- | --- |
| Live TruCV demo | [https://trucv-hackathon.edubuk.com](https://trucv-hackathon.edubuk.com) |
| Demo video | `<ADD_DEMO_VIDEO_URL>` |
| Frontend repository | [https://github.com/edubuk/Edubuk-Trucv](https://github.com/edubuk/Edubuk-Trucv) |
| Backend repository | `https://github.com/edubuk/Edubuk-Trucv-Backend` |
| Smart-contract repository | `https://github.com/edubuk/Edubuk-Trucv/blob/main/src/Blockchain/contract/DocumentNFT.sol` |
| Sepolia contract | [0x27Ca78A18e8C23Aa116C89D9e85eD9f61474afC0](https://sepolia.etherscan.io/address/0x27Ca78A18e8C23Aa116C89D9e85eD9f61474afC0) |

## Demo Access

Replace every placeholder before submitting the repository. Use accounts created exclusively for hackathon judging.

### Candidate account

```text
Login URL: https://trucv-hackathon.edubuk.com/login
Email: averma49696@gmail.com
Password: Test1234
```

This account contain a sample CV and 2 verified documents


## Pre-whitelisted Issuer Wallet

Use a disposable wallet created only for this Sepolia demo. Verify that its address is already present in the TruCV issuer list before publishing this guide.

```text
Network: Ethereum Sepolia
Chain ID: 11155111
Contract: 0x27Ca78A18e8C23Aa116C89D9e85eD9f61474afC0
Issuer wallet address: 0x0f8CEC8A67924ed96E4BD8BEA56C432bA5Ed494e
Disposable Sepolia-only private key: 2ad3cbee5f7fa2a9f0de50124d4f574ca4afea356c076acf644eb15e5027e65d
```

### Import the issuer wallet into MetaMask

1. Open MetaMask and select **Add account or hardware wallet**.
2. Choose **Import account**.
3. Paste the disposable Sepolia private key above.
4. Enable test networks and switch to **Sepolia**.
5. Confirm that the imported address matches the documented issuer wallet address.
6. Open the verification link from the issuer email and connect this wallet.


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

### Login
<img width="2852" height="1644" alt="image" src="https://github.com/user-attachments/assets/c1407626-f55f-4c32-b68c-e4abe277371f" />


### Homepage

<img width="2852" height="1634" alt="image" src="https://github.com/user-attachments/assets/dfdf04dc-a11a-493d-8929-0cda22a589d9" />

### Create TruCV Form Page

<img width="2852" height="1634" alt="image" src="https://github.com/user-attachments/assets/970261cd-d090-4bcd-acc9-37485ebaed0f" />

### Wallet Connect

<img width="2852" height="1634" alt="image" src="https://github.com/user-attachments/assets/f906a270-c6ae-4952-b27d-08aee1e54fd3" />


### Candidate dashboard and CV templates

<img width="2852" height="1634" alt="image" src="https://github.com/user-attachments/assets/bd9875d6-2137-4b1b-8cd3-4d6d9e105571" />
<img width="2852" height="1634" alt="image" src="https://github.com/user-attachments/assets/be48aa68-0e00-40fc-9a94-3827a8d6b47f" />
<img width="1122" height="1628" alt="image" src="https://github.com/user-attachments/assets/62196812-0487-49bb-b63c-a23da1754790" />
<img width="2852" height="1634" alt="image" src="https://github.com/user-attachments/assets/f54e5e9d-6258-4ed4-910e-87988727e7cb" />

### Credential submission By User
<img width="2852" height="1634" alt="image" src="https://github.com/user-attachments/assets/9216a591-ee34-455a-9e3f-136acfd0f934" />
<img width="2876" height="1634" alt="image" src="https://github.com/user-attachments/assets/3f55fd6a-b711-4a53-86c8-96c9c308c696" />


### Issuer review
<img width="2344" height="1510" alt="image" src="https://github.com/user-attachments/assets/179554b7-da2a-4ac4-ad58-f5802430b8a7" />

<img width="2852" height="1634" alt="image" src="https://github.com/user-attachments/assets/7cb258e4-bc9e-450f-82b7-4e1063bd89a8" />


### Admin issuer whitelist and doc verification details 

<img width="2876" height="1634" alt="image" src="https://github.com/user-attachments/assets/6dad884e-66f8-4115-a791-265cab36ab30" />
<img width="2876" height="1634" alt="image" src="https://github.com/user-attachments/assets/1ecdb349-d567-4323-a37d-b983c52731af" />
<img width="2876" height="1634" alt="image" src="https://github.com/user-attachments/assets/022fcd06-2e77-416c-996c-73bf2c9a4f57" />
<img width="2876" height="1634" alt="image" src="https://github.com/user-attachments/assets/7d8d481a-e373-4427-a736-82cdb62003cf" />



### Verified credential and blockchain transaction

<img width="2876" height="1634" alt="image" src="https://github.com/user-attachments/assets/db99d8fe-9c24-40ce-a818-b0eccf1542ee" />
<img width="2876" height="1634" alt="image" src="https://github.com/user-attachments/assets/3681c5f7-914e-4161-b5f2-9bbc92fbb808" />


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


## Support During Judging

```text
Contact name: Edubuk Team
Email: tech@edubuk.com
```

