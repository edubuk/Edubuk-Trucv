// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts@5.0.0/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

// contract DocumentNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {

//     //packed into one slot: 4 + 4 = 8 bytes
//     uint32 public nextId;
//     uint32 private _activeIssuers;
    

//     address[] private _issuerList;

//     error NotAuthorized(address caller);
//     error DocumentAlreadySubmitted(bytes32 hash);
//     error DocumentNotPending(bytes32 hash);

//     enum SubmissionStatus { Pending, Approved, Rejected }

//     struct IssuerInfo {
//         address wallet;
//         string name;
//     }


//     struct Submission {
//         address submitter;       // 20 bytes ─┐ slot 0
//         uint96  submittedAt;     // 12 bytes ─┘ packed!
//         SubmissionStatus status; //  1 byte  — slot 1
//         string name;             // slot 2
//         string docType;          // slot 3
//         string tokenUri;         // slot 4
//         string rejectReason;     // slot 5
//     }


//     struct SubmissionWithHash {
//         bytes32 hash;
//         address submitter;
//         uint96  submittedAt;
//         SubmissionStatus status;
//         string name;
//         string docType;
//         string tokenUri;
//         string rejectReason;
//     }

//     struct Document {
//         address issuer;      // 20 bytes — slot 0
//         address recipient;   // 20 bytes — slot 1
//         uint96  issuedAt;    // 12 bytes ─┐ slot 2
//         bool    isValid;     //  1 byte  ─┘ packed!
//         bytes32 hash;        // slot 3
//         string  name;        // slot 4
//         string  docType;     // slot 5
//     }

//     mapping(address => bool)       public isIssuer;
//     mapping(address => string)     public issuerNames;
//     mapping(bytes32 => Submission) public submissions;
//     mapping(address => bytes32[])  public userSubmissions;
//     mapping(uint256 => Document)   public documents;
//     mapping(bytes32 => uint256)    public hashToTokenId;

//     event DocumentSubmitted(bytes32 indexed hash, address indexed submitter, string name);
//     event DocumentApproved(bytes32 indexed hash, uint256 indexed tokenId, address indexed to);
//     event DocumentRejected(bytes32 indexed hash, string reason);
//     event DocumentRevoked(bytes32 indexed hash, uint256 indexed tokenId);

//     constructor(address initialOwner)
//         ERC721("EDUBUK", "EDUBK")
//         Ownable(initialOwner)
//     {}

//     //modifiers 
//     modifier onlyAuthorized() {
//         if (!isIssuer[msg.sender] && msg.sender != owner())
//             revert NotAuthorized(msg.sender);
//         _;
//     }

//     //issuer management
//     function whitelistIssuer(
//         address issuer,
//         string calldata name
//     ) external onlyOwner {
//         require(issuer != address(0), "Invalid address");
//         require(!isIssuer[issuer], "Already whitelisted");
//         isIssuer[issuer] = true;
//         issuerNames[issuer] = name;
//         _issuerList.push(issuer);
//         unchecked { ++_activeIssuers; }
//     }

//     function revokeIssuer(address issuer) external onlyOwner {
//         require(isIssuer[issuer], "Not whitelisted");
//         isIssuer[issuer] = false;
//         unchecked { --_activeIssuers; }
//     }

//     //step 1: user submits document
//     function submitDocument(
//         string calldata name,
//         bytes32 hash,
//         string calldata docType,
//         string calldata tokenUri
//     ) external {
//         if (submissions[hash].submitter != address(0))
//             revert DocumentAlreadySubmitted(hash);

//         submissions[hash] = Submission({
//             submitter:   msg.sender,
//             submittedAt: uint96(block.timestamp),
//             status:      SubmissionStatus.Pending,
//             name:        name,
//             docType:     docType,
//             tokenUri:    tokenUri,
//             rejectReason: ""
//         });

//         userSubmissions[msg.sender].push(hash);
//         emit DocumentSubmitted(hash, msg.sender, name);
//     }

//     //step 2a: issuer approves
//     function approveDocument(bytes32 hash) external onlyAuthorized {
//         Submission storage sub = submissions[hash];
//         if (sub.status != SubmissionStatus.Pending)
//             revert DocumentNotPending(hash);

//         sub.status = SubmissionStatus.Approved;

//         uint256 tokenId;
//         unchecked { tokenId = ++nextId; }

//         _mint(sub.submitter, tokenId);
//         _setTokenURI(tokenId, sub.tokenUri);

//         documents[tokenId] = Document({
//             issuer:    msg.sender,
//             recipient: sub.submitter,
//             issuedAt:  uint96(block.timestamp),
//             isValid:   true,
//             hash:      hash,
//             name:      sub.name,
//             docType:   sub.docType
//         });

//         hashToTokenId[hash] = tokenId;
//         emit DocumentApproved(hash, tokenId, sub.submitter);
//     }

//     //step 2b: issuer rejects 
//     function rejectDocument(
//         bytes32 hash,
//         string calldata reason
//     ) external onlyAuthorized {
//         Submission storage sub = submissions[hash];
//         if (sub.status != SubmissionStatus.Pending)
//             revert DocumentNotPending(hash);

//         sub.status = SubmissionStatus.Rejected;
//         sub.rejectReason = reason;
//         emit DocumentRejected(hash, reason);
//     }

//     //revoke document
//     function revokeDocument(bytes32 hash) external onlyAuthorized {
//         uint256 tokenId = hashToTokenId[hash];
//         documents[tokenId].isValid = false;
//         emit DocumentRevoked(hash, tokenId);
//     }

//     //verify 
//     function verifyDocument(bytes32 hash)
//         external view
//         returns (bool isValid, Document memory doc)
//     {
//         uint256 tokenId = hashToTokenId[hash];
//         require(tokenId != 0, "Document not found");
//         doc = documents[tokenId];
//         isValid = doc.isValid && doc.hash == hash;
//         return (isValid, doc);
//     }

//     //read: single submission by hash
//     function getSubmission(bytes32 hash)
//         external view
//         returns (SubmissionWithHash memory)
//     {
//         Submission storage sub = submissions[hash];
//         return SubmissionWithHash({
//             hash:         hash,
//             submitter:    sub.submitter,
//             submittedAt:  sub.submittedAt,
//             status:       sub.status,
//             name:         sub.name,
//             docType:      sub.docType,
//             tokenUri:     sub.tokenUri,
//             rejectReason: sub.rejectReason
//         });
//     }

//     //read: all submissions by user (with hash included)
//     function getUserSubmissions(address user)
//         external view
//         returns (SubmissionWithHash[] memory result)
//     {
//         bytes32[] memory hashes = userSubmissions[user];
//         uint256 len = hashes.length;
//         result = new SubmissionWithHash[](len);

//         for (uint256 i; i < len;) {
//             bytes32 hash = hashes[i];
//             Submission storage sub = submissions[hash];
//             result[i] = SubmissionWithHash({
//                 hash:         hash,
//                 submitter:    sub.submitter,
//                 submittedAt:  sub.submittedAt,
//                 status:       sub.status,
//                 name:         sub.name,
//                 docType:      sub.docType,
//                 tokenUri:     sub.tokenUri,
//                 rejectReason: sub.rejectReason
//             });
//             unchecked { ++i; }
//         }
//         return result;
//     }

//     //read: all tokenIds owned by address 
//     function tokensOfOwner(address owner_)
//         external view
//         returns (uint256[] memory tokenIds)
//     {
//         uint256 count = balanceOf(owner_);
//         tokenIds = new uint256[](count);
//         for (uint256 i; i < count;) {
//             tokenIds[i] = tokenOfOwnerByIndex(owner_, i);
//             unchecked { ++i; }
//         }
//         return tokenIds;
//     }

//     // read: paginated issuer list (O(1) total, O(n) window)
//     function getAllIssuers(
//         uint256 offset,
//         uint256 limit
//     ) external view returns (IssuerInfo[] memory result, uint256 total) {
//         total = _activeIssuers;

//         if (offset >= total || limit == 0)
//             return (new IssuerInfo[](0), total);

//         uint256 size = (offset + limit > total) ? total - offset : limit;
//         result = new IssuerInfo[](size);
//         uint256 filled;
//         uint256 skipped;
//         uint256 len = _issuerList.length;

//         for (uint256 i; i < len;) {
//             address addr = _issuerList[i];
//             if (isIssuer[addr]) {
//                 if (skipped < offset) {
//                     unchecked { ++skipped; }
//                 } else {
//                     result[filled] = IssuerInfo({
//                         wallet: addr,
//                         name:   issuerNames[addr]
//                     });
//                     unchecked { ++filled; }
//                     if (filled == size) break;
//                 }
//             }
//             unchecked { ++i; }
//         }
//         return (result, total);
//     }

//     //required overrides
//     function tokenURI(uint256 tokenId)
//         public view
//         override(ERC721, ERC721URIStorage)
//         returns (string memory)
//     {
//         return ERC721URIStorage.tokenURI(tokenId);
//     }

//     function supportsInterface(bytes4 interfaceId)
//         public view
//         override(ERC721, ERC721Enumerable, ERC721URIStorage)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }

//     function _update(address to, uint256 tokenId, address auth)
//         internal
//         override(ERC721, ERC721Enumerable)
//         returns (address)
//     {
//         return super._update(to, tokenId, auth);
//     }

//     function _increaseBalance(address account, uint128 value)
//         internal
//         override(ERC721, ERC721Enumerable)
//     {
//         super._increaseBalance(account, value);
//     }
// }