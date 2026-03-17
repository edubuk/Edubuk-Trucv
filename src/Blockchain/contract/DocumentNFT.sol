// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DocumentNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 public nextId;

    mapping(address => bool) public isIssuer;

    error CallerNotIssuer(address caller, string message);
    error NotAuthorized(address caller);
    error DocumentAlreadySubmitted(bytes32 hash);
    error DocumentNotPending(bytes32 hash);

    enum SubmissionStatus { Pending, Approved, Rejected }

    struct Submission {
        address submitter;
        string name;
        bytes32 hash;
        string docType;
        string tokenUri;
        SubmissionStatus status;
        uint256 submittedAt;
        string rejectReason;
    }

    struct Document {
        string name;
        bytes32 hash;
        address issuer;
        address recipient;
        uint256 issuedAt;
        bool isValid;
        string docType;
    }

    mapping(bytes32 => Submission) public submissions;      // hash => Submission
    mapping(address => bytes32[]) public userSubmissions;   // user => hashes
    mapping(uint256 => Document) public documents;          // tokenId => Document
    mapping(bytes32 => uint256) public hashToTokenId;       // hash => tokenId

    event DocumentSubmitted(bytes32 indexed hash, address indexed submitter, string name);
    event DocumentApproved(bytes32 indexed hash, uint256 indexed tokenId, address indexed to);
    event DocumentRejected(bytes32 indexed hash, string reason);
    event DocumentRevoked(bytes32 indexed hash, uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("DocumentNFT", "DOC") Ownable(initialOwner) {}

    function whitelistIssuer(address issuer) external onlyOwner {
        isIssuer[issuer] = true;
    }

    function revokeIssuer(address issuer) external onlyOwner {
        isIssuer[issuer] = false;
    }

    modifier onlyAuthorized() {
        if (!isIssuer[msg.sender] && msg.sender != owner())
            revert NotAuthorized(msg.sender);
        _;
    }

    // Step 1 — User submits document using hash as key
    function submitDocument(
        string calldata name,
        bytes32 hash,
        string calldata docType,
        string calldata tokenUri
    ) external {
        // prevent duplicate submissions
        if (submissions[hash].submitter != address(0))
            revert DocumentAlreadySubmitted(hash);

        submissions[hash] = Submission({
            submitter: msg.sender,
            name: name,
            hash: hash,
            docType: docType,
            tokenUri: tokenUri,
            status: SubmissionStatus.Pending,
            submittedAt: block.timestamp,
            rejectReason: ""
        });

        userSubmissions[msg.sender].push(hash);

        emit DocumentSubmitted(hash, msg.sender, name);
    }

    //Step 2a — Issuer approves by hash
    function approveDocument(
        bytes32 hash
    ) external onlyAuthorized {
        Submission storage sub = submissions[hash];
        if (sub.status != SubmissionStatus.Pending)
            revert DocumentNotPending(hash);

        sub.status = SubmissionStatus.Approved;

        uint256 tokenId = ++nextId;
        _mint(sub.submitter, tokenId);
        _setTokenURI(tokenId, sub.tokenUri);

        documents[tokenId] = Document({
            name: sub.name,
            hash: hash,
            issuer: msg.sender,
            recipient: sub.submitter,
            issuedAt: block.timestamp,
            isValid: true,
            docType: sub.docType
        });

        //map hash to tokenId for easy lookup
        hashToTokenId[hash] = tokenId;

        emit DocumentApproved(hash, tokenId, sub.submitter);
    }

    //Step 2b — Issuer rejects by hash
    function rejectDocument(
        bytes32 hash,
        string calldata reason
    ) external onlyAuthorized {
        Submission storage sub = submissions[hash];
        if (sub.status != SubmissionStatus.Pending)
            revert DocumentNotPending(hash);

        sub.status = SubmissionStatus.Rejected;
        sub.rejectReason = reason;

        emit DocumentRejected(hash, reason);
    }

    //Revoke by hash
    function revokeDocument(bytes32 hash) external onlyAuthorized {
        uint256 tokenId = hashToTokenId[hash];
        documents[tokenId].isValid = false;
        emit DocumentRevoked(hash, tokenId);
    }

    //Verify by hash directly — no need for tokenId
    function verifyDocument(bytes32 hash)
        external view
        returns (bool isValid, Document memory doc)
    {
        uint256 tokenId = hashToTokenId[hash];
        doc = documents[tokenId];
        isValid = doc.isValid && doc.hash == hash;
        return (isValid, doc);
    }

    //Get submission by hash
    function getSubmission(bytes32 hash) external view returns (Submission memory) {
        return submissions[hash];
    }

    //Get all submissions of a user
    function getUserSubmissions(address user) external view returns (Submission[] memory) {
        bytes32[] memory hashes = userSubmissions[user];
        Submission[] memory result = new Submission[](hashes.length);
        for (uint256 i = 0; i < hashes.length; i++) {
            result[i] = submissions[hashes[i]];
        }
        return result;
    }

    // list all tokenIds owned by an address
    function tokensOfOwner(address owner_) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner_);
        uint256[] memory tokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner_, i);
        }
        return tokenIds;
    }

    // required overrides
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}