// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/*
================================================================================
       THE ARCHITECT'S LEDGER : UNIVERSAL SOVEREIGN INFRASTRUCTURE
                            (WEB3 OMNI-LAYER : BASE MAINNET)
================================================================================
   [ABSOLUTE TRUTH: CONTRACT IS AN IMMUTABLE REGISTRY, NOT A RENDERER]
   [STATUS: UNSTOPPABLE (NO-PAUSE), ONE-TIME NOVA UNLOCK ENABLED]

   I. CORE ARCHITECTURE & DECOUPLING DOCTRINE
   - IMMUTABLE STATE LEDGER: Serves purely as a Registry storing String vectors.
   - LAZY PROVISIONING VAULT (ERC-6551): On-Demand TBA deployment via owner authorization.
   - OFF-CHAIN RENDERING ENGINE: EVM Relief. Front-end extracts 9-parameter strings.

   II. UNIVERSAL PROTOCOL STANDARDS
   - UNIVERSAL WEB3 COMPLIANT : EIP-721 Standard.
   - ERC-6551 TBA NATIVE      : On-chain identity integration (Decoupled/Lazy).
   - EIP-2981 ROYALTY ENFORCED: Native on-chain royalty mapping (7%).
   - EIP-4906 DYNAMIC METADATA: Real-time marketplace event broadcasting.

   III. DYNAMIC DATA & ABSOLUTE SOVEREIGNTY (ONE-TIME UNLOCK)
   - DYNAMIC URI BYPASS: When ABSOLUTE_SOVEREIGNTY = TRUE, bypasses baseURI.
   - ONE-TIME NOVA FEE: Users pay novaFee ONLY ONCE to unlock absoluteSovereignty.
     Subsequent updates are FREE. Council tokens (e.g., 111, 222) are unlocked for FREE.

   IV. UNCOMPROMISED INTEGRITY PROTOCOL (OFF-CHAIN)
   - Contract strictly stores 'DNA' and 'HIDDEN' strings.
================================================================================
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC6551Registry {
    function createAccount(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external returns (address);

    function account(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external view returns (address);
}

interface IERC6551AccountProxy {
    function initialize(address implementation) external;
}

interface IERC6551Account {
    function token()
        external
        view
        returns (uint256 chainId, address tokenContract, uint256 tokenId);
}

contract SovereignInfrastructure is ERC721, ERC2981, Ownable, ReentrancyGuard {
    using Strings for uint256;
    using EnumerableSet for EnumerableSet.UintSet;
    using SafeERC20 for IERC20;

    error ExactAmountRequired();
    error LowFee();
    error NotOwner();
    error TransferFailed();
    error NonexistentToken();
    error InvalidTBAReceiver();
    error MaxBatchExceeded();
    error LengthMismatch();
    error MaxSupplyReached();
    error InvalidAddress();
    error UnauthorizedIdentity();
    error TBAInitFailed();
    error TBAAlreadyExists();
    error TBAImplementationMismatch();
    error ArchitectMintLimitExceeded();
    error InvalidTokenId();
    error AlreadyActive();

    address public constant ERC6551_REGISTRY =
        0x000000006551c19487814612e58FE06813775758;
    address public constant TBA_IMPL =
        0x55266d75D1a14E4572138116aF39863Ed6596E7F;
    address public constant TBA_ACCOUNT_IMPL =
        0x41C8f39463A868d3A88af00cd0fe7102F30E44eC;
    uint256 public constant MAX_SUPPLY = 5555;

    uint256 private _sequenceTracker;
    address public architect;
    uint256 public activeDeedsCount;

    uint256 public mintPrice = 0.05 ether;
    uint256 public novaFee = 0.5 ether;
    uint256 public councilMintPrice = 0.55 ether;

    uint256 public architectMintCount;
    uint256 public totalHistoricalMint;
    mapping(uint256 => bool) public genesisMinted;
    mapping(uint256 => bool) public tokenIsCouncil;

    string public baseURI;

    struct DeedRecord {
        string frontURI;
        string backURI;
        string videoURI;
        string sovereignIdentity;
        string hiddenProperty;
        bool absoluteSovereignty;
        bool isActivated;
    }

    mapping(uint256 => DeedRecord) public registry;

    EnumerableSet.UintSet private _allTokens;
    mapping(address => EnumerableSet.UintSet) private _holderTokens;

    event SovereignForged(address indexed owner, uint256 indexed tokenId);
    event SovereignAbsoluteState(uint256 indexed tokenId, string sovereignIdentity);
    event TBADeployed(uint256 indexed tokenId, address indexed tbaAddress);
    event MetadataUpdate(uint256 _tokenId);
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);

    modifier tokenExists(uint256 t) {
        if (_ownerOf(t) == address(0)) revert NonexistentToken();
        _;
    }

    modifier onlyArchitectOrOwner() {
        if (msg.sender != architect && msg.sender != owner()) {
            revert UnauthorizedIdentity();
        }
        _;
    }

    constructor(address _architect)
        ERC721("Sovereign Protocol", "SOV")
        Ownable(msg.sender)
    {
        if (_architect == address(0)) revert InvalidAddress();
        architect = _architect;
        _setDefaultRoyalty(address(this), 700);
    }

    receive() external payable {}

    function THE_SOVEREIGN_AWAKENING(
        string[] memory fronts,
        string[] memory backs
    ) external payable nonReentrant {
        uint256 qty = fronts.length;
        if (qty > 20) revert MaxBatchExceeded();
        if (qty != backs.length) revert LengthMismatch();
        if (activeDeedsCount + qty > MAX_SUPPLY) revert MaxSupplyReached();

        uint256 expectedValue;
        uint256 tempTracker = _sequenceTracker;

        for (uint256 i = 0; i < qty; i++) {
            tempTracker++;
            while (_ownerOf(tempTracker) != address(0)) {
                tempTracker++;
            }

            if (SOVEREIGNTY_COUNCIL(tempTracker)) {
                expectedValue += councilMintPrice;
            } else {
                expectedValue += mintPrice;
            }
        }

        if (msg.value != expectedValue) revert ExactAmountRequired();

        for (uint256 i = 0; i < qty; i++) {
            _sequenceTracker++;
            while (_ownerOf(_sequenceTracker) != address(0)) {
                _sequenceTracker++;
            }

            uint256 currentTokenId = _sequenceTracker;
            if (currentTokenId > MAX_SUPPLY) revert MaxSupplyReached();

            if (!genesisMinted[currentTokenId]) {
                genesisMinted[currentTokenId] = true;
                unchecked {
                    totalHistoricalMint++;
                }
            }

            unchecked {
                activeDeedsCount++;
            }

            registry[currentTokenId].frontURI = fronts[i];
            registry[currentTokenId].backURI = backs[i];
            registry[currentTokenId].isActivated = true;
            registry[currentTokenId].absoluteSovereignty =
                SOVEREIGNTY_COUNCIL(currentTokenId);

            _safeMint(msg.sender, currentTokenId);
            emit SovereignForged(msg.sender, currentTokenId);
        }
    }

    function THE_SOVEREIGN_NOVA(
        uint256 t,
        string memory DNA,
        string memory HIDDEN
    ) external payable tokenExists(t) nonReentrant {
        if (ownerOf(t) != msg.sender) revert NotOwner();

        bool isAlreadyUnlocked =
            registry[t].absoluteSovereignty || SOVEREIGNTY_COUNCIL(t);
        uint256 requiredFee = isAlreadyUnlocked ? 0 : novaFee;
        if (msg.value < requiredFee) revert LowFee();

        uint256 excess = msg.value - requiredFee;
        registry[t].sovereignIdentity = DNA;
        registry[t].hiddenProperty = HIDDEN;

        if (!isAlreadyUnlocked) {
            registry[t].absoluteSovereignty = true;
        }

        if (excess > 0) {
            _sendETH(msg.sender, excess);
        }

        emit SovereignAbsoluteState(t, DNA);
        emit MetadataUpdate(t);
    }

    function updateIdentity(
        uint256 t,
        string memory front,
        string memory back,
        string memory video
    ) external tokenExists(t) {
        if (ownerOf(t) != msg.sender) revert NotOwner();

        registry[t].frontURI = front;
        registry[t].backURI = back;
        registry[t].videoURI = video;

        emit MetadataUpdate(t);
    }

    function deployTBA(uint256 t)
        external
        nonReentrant
        tokenExists(t)
        returns (address tba)
    {
        if (ownerOf(t) != msg.sender) revert NotOwner();

        if (
            ERC6551_REGISTRY.code.length == 0 ||
            TBA_IMPL.code.length == 0 ||
            TBA_ACCOUNT_IMPL.code.length == 0
        ) {
            revert TBAInitFailed();
        }

        address expectedTba = IERC6551Registry(ERC6551_REGISTRY).account(
            TBA_IMPL,
            bytes32(0),
            block.chainid,
            address(this),
            t
        );

        if (expectedTba.code.length > 0) revert TBAAlreadyExists();

        tba = IERC6551Registry(ERC6551_REGISTRY).createAccount(
            TBA_IMPL,
            bytes32(0),
            block.chainid,
            address(this),
            t
        );

        if (tba == address(0) || tba != expectedTba || tba.code.length == 0) {
            revert TBAInitFailed();
        }

        IERC6551AccountProxy(tba).initialize(TBA_ACCOUNT_IMPL);

        (
            uint256 chainId,
            address tokenContract,
            uint256 tokenId
        ) = IERC6551Account(tba).token();

        if (
            chainId != block.chainid ||
            tokenContract != address(this) ||
            tokenId != t
        ) {
            revert TBAImplementationMismatch();
        }

        emit TBADeployed(t, tba);
    }

    function getTBA(uint256 t) public view returns (address) {
        if (ERC6551_REGISTRY.code.length == 0) return address(0);
        return IERC6551Registry(ERC6551_REGISTRY).account(
            TBA_IMPL,
            bytes32(0),
            block.chainid,
            address(this),
            t
        );
    }

    function totalSupply() external view returns (uint256) {
        return activeDeedsCount;
    }

    function walletOfOwner(address user) external view returns (uint256[] memory) {
        return _holderTokens[user].values();
    }

    function getAllActiveTokens() external view returns (uint256[] memory) {
        return _allTokens.values();
    }

    function SOVEREIGNTY_COUNCIL(uint256 tokenId) public pure returns (bool) {
        if (tokenId < 111 || tokenId > MAX_SUPPLY) return false;
        if (tokenId <= 999 && tokenId % 111 == 0) return true;
        if (tokenId >= 1111 && tokenId % 1111 == 0) return true;
        return false;
    }

    function getDeedData(uint256 t)
        external
        view
        returns (
            address sovereignOwner,
            bool sovereignActive,
            bool absoluteSovereigntyStatus,
            string memory sovereignFront,
            string memory sovereignBack,
            string memory sovereignVideo,
            string memory sovereignIdentity,
            string memory sovereignHidden,
            address sovereignTba
        )
    {
        address tokenOwner = _ownerOf(t);
        if (tokenOwner == address(0)) revert NonexistentToken();

        DeedRecord storage d = registry[t];
        sovereignOwner = tokenOwner;
        sovereignActive = d.isActivated;
        absoluteSovereigntyStatus =
            d.absoluteSovereignty || SOVEREIGNTY_COUNCIL(t);
        sovereignFront = d.frontURI;
        sovereignBack = d.backURI;
        sovereignVideo = d.videoURI;
        sovereignIdentity = d.sovereignIdentity;
        sovereignHidden = d.hiddenProperty;
        sovereignTba = getTBA(t);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return interfaceId == bytes4(0x49064906) || super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        if (to != address(0) && to == getTBA(tokenId)) {
            revert InvalidTBAReceiver();
        }

        address from = super._update(to, tokenId, auth);
        if (from != address(0)) {
            _holderTokens[from].remove(tokenId);
        }
        if (to == address(0)) {
            _allTokens.remove(tokenId);
        }
        if (to != address(0)) {
            _holderTokens[to].add(tokenId);
            if (from == address(0)) {
                _allTokens.add(tokenId);
            }
        }
        return from;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();

        DeedRecord memory d = registry[tokenId];
        if (
            d.absoluteSovereignty &&
            bytes(d.sovereignIdentity).length > 0 &&
            bytes(d.hiddenProperty).length > 0
        ) {
            return d.hiddenProperty;
        }
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

    function withdrawTreasury() external onlyArchitectOrOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            _sendETH(architect, balance);
        }
    }

    function recoverERC20(address tokenAddress) external onlyArchitectOrOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        if (balance > 0) {
            SafeERC20.safeTransfer(IERC20(tokenAddress), architect, balance);
        }
    }

    function setParams(
        uint256 mint_,
        uint256 nova_,
        uint256 council_
    ) external onlyArchitectOrOwner {
        mintPrice = mint_;
        novaFee = nova_;
        councilMintPrice = council_;
    }

    function setBaseURI(string memory uri) external onlyArchitectOrOwner {
        baseURI = uri;
        emit BatchMetadataUpdate(1, type(uint256).max);
    }

    function setArchitect(address _newArchitect) external onlyArchitectOrOwner {
        if (_newArchitect == address(0)) revert InvalidAddress();
        architect = _newArchitect;
    }

    function _sendETH(address to, uint256 amount) internal {
        if (amount == 0) return;
        (bool success, ) = payable(to).call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    function ARCHITECT_MINT(
        uint256[] memory t,
        address to,
        string[] memory fronts,
        string[] memory backs
    ) external onlyArchitectOrOwner {
        uint256 qty = t.length;
        if (qty == 0 || qty > 50) revert MaxBatchExceeded();
        if (qty != fronts.length || qty != backs.length) revert LengthMismatch();
        if (architectMintCount + qty > 300) revert ArchitectMintLimitExceeded();

        unchecked {
            architectMintCount += qty;
        }

        for (uint256 i = 0; i < qty; i++) {
            uint256 tokenId = t[i];
            if (tokenId < 1 || tokenId > MAX_SUPPLY) revert InvalidTokenId();
            if (_ownerOf(tokenId) != address(0)) revert AlreadyActive();

            if (!genesisMinted[tokenId]) {
                genesisMinted[tokenId] = true;
                unchecked {
                    totalHistoricalMint++;
                }
            }

            unchecked {
                activeDeedsCount++;
            }

            registry[tokenId].frontURI = fronts[i];
            registry[tokenId].backURI = backs[i];
            registry[tokenId].isActivated = true;
            registry[tokenId].absoluteSovereignty =
                SOVEREIGNTY_COUNCIL(tokenId);

            _safeMint(to, tokenId);
            emit SovereignForged(to, tokenId);
        }
    }
}