# SOVEREIGN PROTOCOL

## Sovereign Infrastructure · STANDARD 3D NFT · SPACECRAFT 3D NFT

**Production-Ready High-Performance Web3 Architecture**  
**Your Token. Your Media. Your Choice.**

Sovereign Protocol is a holder-oriented Web3 ecosystem built on Base. It combines an ERC-721 smart contract, owner-controlled digital identity, a multifunctional dashboard, metadata and media infrastructure, Token Bound Accounts (TBAs), and interactive 3D digital products.

This is not a static-image-only NFT concept. Sovereign Protocol connects on-chain ownership with playable, game-like 3D experiences, self-contained HTML viewers, RPC-powered token inspection, changeable identity references, external-service integrations, and holder-directed media presentation.

The project is designed around one central principle:

> **The token holder decides what their token represents, what media it references, how its identity evolves, and which external services they choose to use. The infrastructure exists to enable those choices—not to make those choices on the holder’s behalf.**

## Executive Summary

Sovereign Protocol brings together three connected layers:

1. **Smart Contract — Ownership, Identity and On-chain Operations**  
   An ERC-721 collection on Base with holder-directed identity and media references, configurable metadata routing, token information functions, and ERC-6551 Token Bound Account integration.

2. **Infrastructure — Dashboard, API, RPC and Media Pipeline**  
   The dashboard connects contract operations with media upload and identity configuration. The metadata gateway reads token data from Base, resolves the configured media references, builds marketplace-compatible metadata, and supports multiple RPC endpoints. The HTML product viewers can include RPC configuration for read-only blockchain information without requiring a wallet connection just to experience the local 3D scene.

3. **Products — STANDARD and SPACECRAFT**  
   STANDARD presents the Crystal Energy Core digital-art experience. SPACECRAFT presents ARC-01 and the Sovereignty Fleet through interactive, game-like 3D scenes, cinematic environments, propulsion effects, HUD elements, and spacetime-inspired transitions.

The result is an integrated Web3 product architecture where **ownership, identity, media and presentation are connected but remain distinct**. Holders can update supported identity references as their work evolves, use external endpoints for their own purposes, and present their tokens through dynamic media experiences rather than being limited to one permanent image.

### Live Links

- **Dashboard:** https://sovereign-council.xyz
- **OpenSea Collection:** https://opensea.io/collection/sovereign-protocol
- **ARC-01 / Deed #1:** https://opensea.io/item/base/0x06040f2e5301b2616491e113962a84d372b8f600/1
- **Base Contract:** https://basescan.org/address/0x06040F2e5301B2616491E113962A84d372b8f600
- **Dashboard & Product Repository:** https://github.com/machiavelliandarkcoolempire-eng/Sovereign-absolute
- **Metadata Gateway Repository:** https://github.com/machiavelliandarkcoolempire-eng/fluffy-rotary-phone

---

## Current Implementation and Roadmap

This section separates capabilities present in the project from future expansion targets. The distinction is about product status—not about the ambition or scope of the architecture.

### Implemented / Present in the Current Project

- **Base ERC-721 collection:** Sovereign Protocol contract deployment and token collection identified by the project’s contract address.
- **Holder-directed token identity:** Contract functions for changing supported identity and media-reference fields, including front, back, video, DNA and HIDDEN metadata references.
- **Metadata routing:** Token metadata follows the contract’s URI rules, including the holder-configured HIDDEN URI when the required identity fields are set.
- **Token Bound Account integration:** ERC-6551 TBA-related contract and dashboard workflows.
- **Multifunctional dashboard:** Token inspection and interfaces for identity, media and contract-related operations.
- **Interactive product viewers:** Separate HTML experiences for ARC-01, fleet ships, STANDARD/Sovereign Awakening, and the Sovereign Council/dashboard.
- **Self-contained 3D delivery:** Product experiences are distributed as HTML files with their principal rendering code and assets packaged into the viewer, reducing dependence on external asset downloads for the core scene.
- **RPC-powered inspection:** The on-chain product variant and dashboard can use RPC access to read supported token data from Base.
- **Irys upload initialization:** The dashboard repository includes a WebUploader integration using the Ethereum adapter and Ethers v6 provider/signer flow.
- **Metadata API:** The metadata gateway reads Deed data from Base, resolves holder-configured media, builds marketplace metadata, maps media into image and animation fields, parses DNA traits, uses caching logic, and exposes a health endpoint.
- **Media-aware metadata:** The gateway can identify supported image, video, audio, HTML and 3D-related media formats and map available references into marketplace metadata fields.
- **ARC-01 flagship experience:** A cinematic spacecraft viewer with interactive, game-like visual scenes and propulsion/warp-themed effects.
- **STANDARD / Crystal Energy Core:** A browser-based 3D artwork experience with crystal geometry, particle rings, lighting, ambient audio and audio-responsive visual effects.
- **Marketplace presentation:** The Sovereign Protocol collection and ARC-01 / Deed #1 listing are available through the linked OpenSea pages.

### Architecture Capabilities

The architecture supports holders using DNA, HIDDEN and media fields as configurable references for their own artwork, websites, creator profiles, brands, APIs, metadata services and identity systems. These references can also point to external or cross-chain identity resources. The external service determines how such a reference is interpreted and what additional verification or cross-chain operations it provides.

The system also includes a three-screen concurrent-media presentation concept, with image, video and interactive experiences intended to coexist in a single presentation environment. Presentation formats and simultaneous playback depend on the viewer and media supplied.

### Roadmap / Planned Expansion

- **Sovereignty Fleet expansion:** The broader roadmap targets 15 spacecraft models.
- **Additional spacecraft experiences:** Six finished models are identified in the current project materials; the remaining models are planned expansion rather than part of that six-model count.
- **Continued product evolution:** Additional spacecraft identities, scenes and presentation experiences can expand the product family while retaining the shared token, metadata and viewer architecture.

The 15-model target is a roadmap total, not a claim that all 15 models are already completed.

---

## 1. Project Architecture at a Glance

    SOVEREIGN PROTOCOL
             |
       +-----+-----------------------------+
       |                                   |
    SMART CONTRACT                    INFRASTRUCTURE
      BASE MAINNET                          |
       |                       +------------+-----------+
    ERC-721 / NFT              |            |           |
       |                    Dashboard      API      Media Services
    Token Identity              |            |       Irys / Arweave
       |                        +------------+-----------+
    ERC-6551 / TBA                          |
       |                             Metadata References
       |                                    |
       +-----------------+------------------+
                         |
              +----------+----------+
              |                     |
          STANDARD               SPACECRAFT
       Crystal Energy Core     ARC-01 & Fleet
              |                     |
              +----------+----------+
                         |
                 Interactive Viewers
               Live Media / 3D / Video

The architecture separates responsibilities while allowing the components to work together.

- **Smart contract:** Records ownership and executes the on-chain functions defined by its code.
- **Dashboard:** Gives users an interface for invoking supported contract functions and managing identity and media references.
- **API and metadata infrastructure:** Reads the relevant on-chain fields and builds the metadata representation consumed by marketplaces and viewers.
- **Irys and Arweave integration:** Supports the media-upload workflow and the use of returned transaction identifiers or URLs.
- **Product viewers:** Present digital artwork and interactive 3D experiences, with optional read-only blockchain information.

The dashboard is not a separate product unrelated to the contract. It is the user-facing operational interface through which the contract and supporting infrastructure become useful to token holders.

---

## 2. Smart Contract — Sovereign Ownership and Dynamic Identity

### Contract Information

| Property | Details |
|---|---|
| Contract | **SovereignInfrastructure** |
| Network | Base Mainnet |
| Chain ID | **8453** |
| Standard | ERC-721 |
| Collection name | Sovereign Protocol |
| Symbol | SOV |
| Maximum supply | 5,555 tokens |
| Royalty standard | ERC-2981 |
| Token-bound account architecture | ERC-6551 integration |
| Metadata update signalling | EIP-4906 interface support |
| Contract address | **0x06040F2e5301B2616491E113962A84d372b8f600** |

### 2.1 Ownership Means Control Over the Holder’s Own Token

Sovereign Protocol is built around the distinction between **infrastructure administration** and **individual token ownership**.

The Architect and authorized contract administrator have specific infrastructure-level powers defined by the contract. Those powers are not equivalent to ownership of every token held by other wallets.

The intended division of responsibility is:

- **Token holder:** Decides how their token’s supported identity fields and media references are used, within the available contract functions and applicable external services.
- **Smart contract:** Enforces the rules encoded in its functions and records the relevant on-chain state.
- **Architect and infrastructure operators:** Build, maintain, improve and support the ecosystem’s infrastructure.

The Architect’s role is to provide infrastructure, maintenance, development, assistance and support—not to make the holder’s personal creative decisions.

A holder may choose an artwork, photograph, video, 3D model, external API, personal project or brand identity as the content associated with their token. The holder makes that choice; the system does not automatically select content for them.

### 2.2 Dynamic Token Identity

Sovereign Protocol separates the token’s on-chain collection identity from its configurable media and identity references.

The contract includes these principal functions:

| Function | Purpose |
|---|---|
| **THE_SOVEREIGN_AWAKENING** | Public minting of Sovereign Protocol tokens |
| **ARCHITECT_MINT** | Authorized administrative minting under contract limits |
| **updateIdentity** | Updates a token’s front, back and video references |
| **THE_SOVEREIGN_NOVA** | Sets the token’s identity DNA and hidden metadata URI |
| **tokenURI** | Returns the token’s metadata URI according to the contract’s rules |
| **getDeedData** | Retrieves token ownership, identity and related data |
| **deployTBA** | Deploys and initializes a token-bound account through the configured ERC-6551 infrastructure |
| **getTBA** | Derives the token-bound account address |
| **setBaseURI** | Changes the collection’s base metadata URI |
| **setArchitect** | Changes the designated Architect address, subject to the contract’s rules |

Identity is not restricted to a single permanent visual interpretation. A token holder can update supported identity and media references as their creative work, business, brand or personal project evolves.

The holder can therefore use the same token as a continuing identity container rather than treating its first image as the end of its utility.

### 2.3 Identity DNA and HIDDEN: Programmable Identity

**DNA and HIDDEN are flexible string fields—not a fee for purchasing personal freedom.**

Their usefulness comes from what the holder chooses to associate with them.

Potential applications include:

- Connecting a token to a personal website, creator profile or brand.
- Referencing a project, artwork collection or creative portfolio.
- Linking an identity to an external API or metadata service.
- Referencing URLs or records used in a holder’s own identity-verification workflow.
- Associating a digital artwork with a physical-world product, brand or commercial project.
- Maintaining a changing identity as a project evolves.
- Using an external reference as part of a provenance, access, membership or claim workflow implemented by the relevant external system.
- Pointing to identity resources or applications hosted on another chain.

For example, a creator could develop an original alien-dog character, associate its digital identity with a token, and use the character in artwork, NFT media, a website, merchandise, toys or other real-world products. DNA can serve as a flexible identity reference within that creator’s chosen architecture.

A business could also use identity references to connect a token with its own website or verification service. A URL can be part of such a system; the external system defines how it validates a claim, entitlement, licence or real-world ownership record.

**The important architectural property is flexibility:** the contract accepts strings, while the holder decides what those strings mean within their own application.

### 2.4 Updating DNA, HIDDEN and Media Identity

The contract’s Nova function sets the identity DNA and HIDDEN URI. An already-consecrated token can invoke Nova again without the initial Nova fee under the contract’s existing fee conditions, allowing its owner to change those values.

The **updateIdentity** function separately updates the front, back and video references.

These operations are owner-controlled and can be repeated; they are not designed around a fixed lifetime quota of identity changes. Transactions remain subject to network availability, gas costs and the conditions enforced by the contract.

Nova is currently configured for the project at **0.1 ETH**. The contract’s parameter-setting mechanism can change fee parameters, so the effective on-chain value is the value currently configured in the deployed contract.

Nova is an identity and metadata configuration mechanism. It should not be described as a purchase of freedom or as a transfer of control over other people’s tokens.

### 2.5 Metadata URI and External Services

Sovereign Protocol supports a collection-level base URI and a holder-configured HIDDEN URI.

When the contract’s required Nova identity fields are set, **tokenURI** returns the holder-configured HIDDEN URI. Otherwise, it returns the collection’s base URI followed by the token ID and **.json**.

This makes it possible for holders to use their own metadata endpoint rather than relying exclusively on the collection’s default metadata path.

External APIs can provide dynamic metadata and media for a token. If a holder configures a personal API and that API becomes unavailable, the holder or relevant service operator can restore the service, change the configured URI or adopt another arrangement.

The smart contract does not turn a referenced external asset into an asset owned by the token holder. For example, linking to an image of an existing CryptoPunk does not transfer ownership of that original Ethereum NFT. The Base token remains a Sovereign Protocol token; the external image is its referenced media.

### 2.6 Token Bound Accounts

Sovereign Protocol includes integration with ERC-6551 Token Bound Accounts.

A TBA provides a token-associated account address through the configured ERC-6551 registry and implementation infrastructure. It can serve as a foundation for applications that associate assets or activity with a particular token.

The dashboard supports inspecting the relevant TBA address and related token information. A TBA gives the ecosystem a token-associated account layer that can be used by compatible applications and workflows.

---

## 3. Infrastructure — Dashboard, API, RPC and Media Pipeline

The infrastructure is the operational layer that connects users, smart-contract functions, media storage, metadata references and products.

It is not merely a minting page. It is designed as a multifunctional interface for interacting with the protocol.

### 3.1 The Dashboard: Pen, Media Workstation and Display

The dashboard serves three conceptual roles.

**The pen — create and write identity**

Users enter the information they want to associate with their token, including media references, identity DNA and HIDDEN URI. The dashboard provides an interface for submitting the corresponding supported contract transactions.

**The media workstation — upload and prepare content**

Users can upload media through the integrated Irys workflow, receive a transaction identifier or reference, and use the resulting reference in their token’s identity configuration.

**The display — present and inspect media**

The dashboard and viewer components can present images, video and interactive 3D content, including front/back media arrangements and different presentation formats.

Together, these roles form a connected user workflow: prepare media, obtain a reference, write the reference to the token’s on-chain identity and present the resulting experience.

### 3.2 Irys and Arweave Media Workflow

The media-transmission interface integrates an Irys upload workflow with a stated maximum payload capacity of **500 MB per upload**.

The intended process is:

1. The user selects an image, video, audio file or other supported media type.
2. The dashboard sends the media through the configured Irys integration.
3. The upload process returns a transaction identifier or media reference.
4. The user chooses how the returned reference should be used.
5. The user submits the relevant identity update transaction to the smart contract.
6. The dashboard or viewer uses the configured reference to present the associated content.

For example, a creator can upload a newly produced dog-character artwork, obtain its media reference, and submit that reference through **updateIdentity** as the front image URI. The creator can also configure a back reference or video reference where supported.

**Uploading content and updating the NFT are separate actions.** Obtaining an Irys transaction ID does not, by itself, change the smart contract. The holder submits the relevant on-chain transaction to update the token’s identity.

### 3.3 API and Metadata Gateway

The API and metadata gateway provide the service layer between media references, metadata consumers and the presentation experience.

The current metadata API implementation:

- Reads Deed data from the configured Base contract.
- Uses multiple RPC endpoints for on-chain reads.
- Retrieves owner, active status, sovereignty status, front/back/video references, DNA, HIDDEN and TBA information through **getDeedData**.
- Resolves configured media references and identifies supported media types.
- Builds marketplace-compatible metadata, including **image**, **animation_url**, **external_url** and attributes.
- Converts DNA trait strings into metadata attributes.
- Includes response caching, request-rate limiting and a health endpoint.

This layer lets media references be presented through marketplace metadata without requiring the smart contract itself to host arbitrary files or render a 3D scene.

The architecture intentionally allows holders to reference external endpoints through the available identity fields. A creator can use an endpoint associated with their artwork; a business can maintain a project metadata service; a holder can use an external API for a dynamic identity experience; and a viewer can resolve media references for presentation.

### 3.4 RPC-Powered HTML Products

The product viewers are delivered as HTML experiences, with principal rendering code and assets packaged into the viewer. RPC configuration can be included for reading supported on-chain data from Base.

This architecture combines local real-time rendering with optional network-connected token inspection:

- **Local 3D experience:** Renders in the browser without requiring a wallet connection simply to view the scene.
- **Read-only blockchain information:** Uses internet access and a configured RPC endpoint.
- **Wallet transactions:** Require an appropriate wallet/provider flow and authorization; read-only access does not itself sign a transaction.
- **External media:** Can be loaded using the configured media references and the viewer’s supported formats.

The result is a portable, browser-based digital product that can provide an interactive 3D experience while keeping blockchain inspection and signed ownership operations distinct.

### 3.5 Three Simultaneous Live Media Screens

The presentation infrastructure includes a design for **three media screens operating concurrently**, with experiences that can include live media or streamed content.

The screens are intended to allow multiple content views to be presented at the same time rather than forcing the user to choose only one active display.

Supported presentation concepts include:

- Images and artwork.
- Video.
- Interactive 3D scenes.
- Front/back media and flip-card presentation.
- Different viewing proportions, including 1:1, 9:16 and 3:4, where supported by the relevant viewer.
- Token-related visual experiences alongside blockchain information.

Running three live streams simultaneously can use significant battery, memory, network bandwidth and rendering resources. The viewer’s actual presentation depends on the media format, device, browser, network and relevant service.

The user determines the content and references they configure. The infrastructure provides the tools to present those choices.

### 3.6 Holder-Controlled Operations

The dashboard is designed to make the contract’s available operations accessible through a user-facing interface.

The intended workflow covers token inspection, minting where available, TBA interaction, identity DNA and HIDDEN configuration, and media identity updates.

The dashboard invokes supported operations; authorization and transaction rules remain enforced by the smart contract.

---

## 4. Products — Two Connected Digital Product Families

Sovereign Protocol’s infrastructure supports multiple kinds of digital experiences. The project’s product layer includes two principal families:

1. **STANDARD — Crystal Energy Core and related digital-art experiences**
2. **SPACECRAFT — ARC-01 Sovereignty Architect Flagship and the Sovereignty Fleet**

These products are not the same thing as the infrastructure. They are creative experiences built to use the ecosystem’s identity and presentation capabilities.

---

## 5. STANDARD — Crystal Energy Core · Sovereign Awakening

### Product Concept

**CRYSTAL ENERGY CORE — SOVEREIGN AWAKENING** is a real-time, browser-based 3D digital-art experience built around a luminous crystal, rotating particle rings, layered depth, lighting effects and ambient audio.

The experience is designed to be distributed as a single HTML file with the principal 3D rendering components and embedded assets packaged inside it.

### Interactive Experience

The product includes these presentation elements:

- A three-dimensional crystal that rotates continuously.
- Particle rings with distinct foreground and background layers.
- Lighting and bloom effects.
- Ambient audio that the viewer can enable or disable.
- Audio-reactive visual effects that change selected particle and ring properties according to measured sound intensity.
- Interactive camera controls.
- Read-only access to supported on-chain token information through embedded RPC configuration.

The audio-reactive effects create a relationship between sound and the artwork’s visual behaviour. They are sound-level-responsive effects that change the presentation in real time.

### Real-Time and Offline Use

The 3D scene is designed to render locally in the browser. Embedded rendering assets reduce the need to download the main 3D libraries or audio files from external services.

The experience does not require a wallet connection simply to view and interact with the local artwork.

Its local and online capabilities are distinct:

- **Local 3D experience:** Designed to operate without a wallet and with the principal assets embedded in the HTML file.
- **Blockchain information:** Requires internet access and a working RPC endpoint.
- **Wallet transactions:** Are not implied by the read-only blockchain viewer.
- **Offline use:** The local artwork can render without live RPC data, while online blockchain information requires connectivity.

The product combines a locally rendered digital-art experience with optional network-connected token inspection.

---

## 6. SPACECRAFT — ARC-01 Sovereignty Architect Flagship & Fleet

### Product Concept

**ARC-01** is the Sovereignty Architect Flagship: an interactive spacecraft experience presented through a cinematic science-fiction environment.

Its visual direction combines metallic black and gold, high-contrast lighting, propulsion effects, HUD-style interface elements, planetary environments and a simulated transition through spacetime.

The accompanying fleet extends the visual universe into additional spacecraft identities and 3D experiences.

### ARC-01 and the Spacetime Narrative

The ARC-01 experience uses concepts associated with Einstein–Rosen bridges, wormholes, spacetime geometry and gravitational singularities as the foundation for its science-fiction art direction.

Its intended sequence comprises five stages.

**1. Flat spacetime and sub-light cruise**

The spacecraft cruises through a conventional space environment containing planets and debris. Its propulsion systems remain active while the experience prepares for a warp sequence.

**2. Plasma cannon breach and gravitational singularity**

A plasma-firing sequence introduces a concentrated energy effect and a simulated spacetime disruption. The visual narrative represents a singularity and the opening of a wormhole.

**3. Traversing the wormhole throat**

The ship enters a tunnel-like environment built from rotating energy rings, neon light and spatial distortion. The visual concept represents a transition through a compressed spacetime route rather than ordinary flight across the entire distance.

**4. White-hole emergence and restabilization**

The spacecraft emerges into a new environment. Warp effects fade, and the presentation returns toward a stable flight state.

**5. New-sector calibration and reset**

The experience transitions into a new space environment and begins another cycle.

These stages are a fictional, interactive visualization inspired by theoretical physics. The product uses the concepts as a creative and cinematic framework.

### Interaction and Presentation

The ARC-01 product experience is designed around an interactive 3D scene, including spacecraft movement, propulsion and weapon effects, camera controls, HUD elements and cinematic environmental transitions.

The product’s presentation combines:

- A recognizable flagship silhouette.
- Metallic materials and high-contrast lighting.
- Multiple propulsion effects.
- Space environments and particle effects.
- Interactive flight and visual effects.
- A browser-based 3D viewing experience.
- Plasma- and warp-themed controls shown in the viewer interface.

### Fleet and Expansion

The broader SPACECRAFT product family includes the flagship and a planned collection of additional spacecraft designs.

The current project materials identify six finished ship models:

- ARC-01
- Fleet model 1111
- Fleet model 2222
- Fleet model 3333
- Fleet model 4444
- Fleet model 5555

The broader creative roadmap targets **15 spacecraft models**, with additional designs planned. The roadmap total should not be confused with the six models identified as finished.

The fleet is part of the same overall product architecture: distinct digital products can be presented through interactive viewers while using the wider infrastructure’s media and token-information capabilities.

---

## 7. Product Delivery and User Experience

The project brings together three experiences that are often treated separately.

**Ownership:** The smart contract records the token and exposes the operations defined by its rules.

**Identity:** Holders can configure supported media and identity references and update them through the relevant owner-authorized functions.

**Presentation:** Browser-based products display artwork, video or interactive 3D content without making wallet connection a prerequisite for ordinary viewing.

This separation matters. A viewer can display an artwork without signing a blockchain transaction. A read-only RPC call can retrieve public token information without taking custody of a wallet. An identity update, by contrast, requires the appropriate on-chain transaction.

The products can therefore provide a rich viewing experience while keeping ownership operations distinct from ordinary media presentation.

---

## 8. Project Links

- **Dashboard:** https://sovereign-council.xyz
- **OpenSea Collection:** https://opensea.io/collection/sovereign-protocol
- **ARC-01 / Deed #1:** https://opensea.io/item/base/0x06040f2e5301b2616491e113962a84d372b8f600/1
- **Smart contract on BaseScan:** https://basescan.org/address/0x06040F2e5301B2616491E113962A84d372b8f600
- **Dashboard and product repository:** https://github.com/machiavelliandarkcoolempire-eng/Sovereign-absolute
- **Metadata gateway repository:** https://github.com/machiavelliandarkcoolempire-eng/fluffy-rotary-phone

### Relevant Implementation Files

- **index.html** — Sovereign dashboard and browser interface.
- **index.js** — Irys WebUploader initialization using the Ethereum adapter and Ethers v6.
- **ARC-01.html** — ARC-01 flagship 3D experience.
- **SHIP_1111.html**, **SHIP_2222.html**, **SHIP_3333.html**, **SHIP_4444.html**, **SHIP_5555.html** — fleet product experiences.
- **SOVEREIGN_AWAKENING.html** — STANDARD / Crystal Energy Core experience.
- **SOVEREIGN_AWAKENING_onchain.html** — on-chain-aware Sovereign Awakening variant.
- **SOVEREIGN_COUNCIL.html** — Sovereign Council experience.
- [Metadata gateway index.ts](https://github.com/machiavelliandarkcoolempire-eng/fluffy-rotary-phone/blob/main/index.ts) — metadata API implementation.

---

## 9. Architectural Principles

### Holder-Directed Identity

The holder chooses the supported identity and media references associated with their token. The infrastructure does not automatically make creative decisions for them.

### Infrastructure as a Service Layer

The Architect’s role is to develop, maintain and support the ecosystem. Contract administration and infrastructure maintenance are distinct from ownership of another user’s token.

### Dynamic Media

A token’s presentation can evolve through updated identity fields and metadata references. The token does not need to be defined forever by its initial image.

### Separation of Storage, Contract and Presentation

The storage service holds media; the contract records ownership and configured references; the API and metadata layer serves data; and the viewer presents the experience.

### Real-Time Digital Products

The STANDARD and SPACECRAFT product families use browser-based rendering to deliver interactive digital artwork and 3D experiences. Their HTML delivery model supports portability while RPC connectivity adds read-only access to supported on-chain information.

### Optional Blockchain Inspection

The products can display supported read-only blockchain data without requiring wallet connection for ordinary viewing.

### User Choice Over External Services

A holder can configure external identity, media or metadata services. The holder or relevant service operator decides how to maintain or change those services as needed.

### Cross-Chain Identity References

The identity fields can be used as flexible references to external and cross-chain resources. The relevant chain or external application defines the functionality behind a reference, while Sovereign Protocol provides the holder-directed identity layer.

---

## 10. Project Summary

Sovereign Protocol is a connected Web3 architecture that combines:

- An ERC-721 smart contract on Base.
- Holder-controlled identity and configurable metadata references.
- Identity DNA and HIDDEN URI functionality.
- ERC-6551 Token Bound Account integration.
- A multifunctional dashboard for interacting with contract operations.
- An Irys media-upload workflow with a stated 500 MB payload capacity.
- RPC-powered token inspection in supported viewers.
- API and metadata infrastructure that reads Deed state and builds marketplace-compatible metadata.
- A three-screen concurrent-media presentation concept.
- STANDARD digital-art experiences, including Crystal Energy Core.
- SPACECRAFT experiences, including ARC-01 and the wider fleet.
- Real-time browser-based 3D presentation with game-like interaction and optional read-only blockchain information.
- Holder-configured links to external identity, media, metadata and cross-chain resources.

The infrastructure and products are designed to work together: the contract provides the on-chain foundation, the dashboard gives holders an operational interface, the media infrastructure connects content to identity, and the products turn those capabilities into interactive digital experiences.

**Sovereign Protocol is built around a clear division of responsibility: the holder directs their token’s identity; the contract enforces its encoded rules; and the infrastructure exists to support the holder’s choices.**

**YOUR TOKEN. YOUR MEDIA. YOUR CHOICE.**
