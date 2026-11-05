# SOVEREIGN MEDIA STATION

## Sovereign Media Station — On-chain Identity, Media Infrastructure & Interactive Digital Experiences

**YOUR TOKEN. YOUR MEDIA. YOUR CHOICE.**

**Sovereign Protocol is an integrated Web3 platform on Base that connects on-chain ownership to changeable digital identity, media delivery and interactive 3D presentation.** It brings together the smart contract, the holder dashboard, the metadata gateway/API, the media workflow and browser-based 3D products as one connected system.

> **Sovereign turns a token from a static collectible into a configurable digital identity and media container — with the infrastructure to manage it, deliver it and bring it to life.**

---

## Why Sovereign

**Infrastructure, not just a collection.** Sovereign is a service layer for token-linked media. It works for the holder of any Sovereign token, and it can display media from any NFT project on any chain.

**Unlimited media changes. Zero contract fees.** Holders change Front, Back and Video through `updateIdentity` as many times as they like. There is no update limit, no contract fee and no NOVA required — the holder pays only network gas. The Base URI metadata gateway delivers every change to marketplaces and viewers, so the token is never locked to its first image.

**Any project. Any chain. Any media.** A holder can point Front, Back and Video to any URL. The contract places no restriction on the source and does not verify ownership of the referenced asset. The choice of what to display belongs entirely to the holder. What a marketplace shows is always the holder's **THE IMPERIAL SOVEREIGN DEED** token, with its own name and token number, presenting the media the holder chose.

**Modular, yet one system.** The contract, gateway, dashboard and 3D viewers each do one job, and together they run as a single working product.

**Ownership is the holder's from mint.** The contract has no function to transfer, burn, freeze or pause a holder's token. A holder who wants a fully independent metadata endpoint can route `tokenURI` to it through NOVA.

**Pricing built for promotions.** Mint, Nova and Council prices are adjustable through `setParams`. This was planned before deployment so the project can run campaigns and make access easier. Price changes apply only to new mints and new Nova activations; an existing token is never affected.

**Three live screens, one token.** The dashboard shows the holder's flip card, STANDARD 3D and SPACECRAFT 3D side by side, each with its own full-screen mode.

**A growing fleet.** Eight spacecraft are completed and two are in final finishing, with a 15-model roadmap.

---

## Live Links

- **Dashboard:** https://sovereign-council.xyz
- **OpenSea Collection:** https://opensea.io/collection/sovereign-protocol
- **ARC-01 / Deed #1:** https://opensea.io/item/base/0x06040f2e5301b2616491e113962a84d372b8f600/1
- **Base Contract:** https://basescan.org/address/0x06040F2e5301B2616491E113962A84d372b8f600
- **Dashboard & Product Repository:** https://github.com/machiavelliandarkcoolempire-eng/Sovereign-absolute
- **Metadata Gateway Repository:** https://github.com/machiavelliandarkcoolempire-eng/fluffy-rotary-phone
- **Backend API (metadata gateway, live):** https://fluffy-rotary-phone-bice.vercel.app/

---

## What Customers and Partners Can Get

| Opportunity | What it provides | Value |
|---|---|---|
| **Token-linked identity** | Holder-directed Front, Back and Video references recorded on-chain | A digital identity that evolves without replacing the token |
| **Media and metadata infrastructure** | Dashboard, metadata gateway/API, media-reference handling, RPC-supported inspection | One connected workflow to manage and present token-linked media |
| **Interactive digital experiences** | STANDARD and SPACECRAFT browser-based 3D viewers | Richer ways to showcase digital assets, products, stories and brands |
| **Custom integration / licensing** | The existing architecture as a base for a partner-specific deployment | A starting point for teams that want to use or adapt the infrastructure |

*Commercial licensing, deployment scope, support, pricing and any sales commission are agreed separately and documented before a deal is represented as available.*

## Who Should Look at Sovereign

- **Web3 protocols and product teams** exploring token-linked identity, metadata routing or media presentation.
- **Digital-asset brands and creators** who want token-associated media that can evolve after minting.
- **Creative technology and 3D studios** that need an on-chain-connected presentation layer.
- **Marketplaces and platform integrators** evaluating metadata and media workflows.
- **Commercial partners and sales representatives** who can introduce the platform to buyers and structure qualified deals.

---

## Current Implementation and Roadmap

### Implemented

- **Base ERC-721 collection:** Sovereign Protocol (`SOV`), maximum supply 5,555, ERC-2981 royalties, EIP-4906 metadata update events.
- **Holder-directed identity:** From mint onward, the owner uses `updateIdentity` to change Front URI, Back URI and Video URI, with no limit on the number of updates. Each update emits `MetadataUpdate` so marketplaces can refresh.
- **Metadata routing:** Tokens use the project Base URI / metadata gateway by default. When a token has ABSOLUTE SOVEREIGNTY status and both DNA and HIDDEN are non-empty, `tokenURI` returns the holder-supplied HIDDEN string, allowing an independently operated metadata endpoint or domain.
- **Token Bound Accounts:** ERC-6551 contract and dashboard workflows.
- **Multifunctional dashboard:** Token inspection and interfaces for identity, media and contract operations.
- **Interactive product viewers:** HTML experiences for ARC-01, fleet ships, STANDARD / Sovereign Awakening and the Sovereign Council.
- **Self-contained 3D delivery:** Viewers are distributed as HTML files with their principal rendering code and assets packaged in, reducing dependence on external downloads for the core scene.
- **RPC-powered inspection:** Viewers and the dashboard can read supported token data from Base.
- **Irys upload workflow:** WebUploader integration using the Ethereum adapter and Ethers v6 provider/signer flow.
- **Metadata API:** Reads Deed data from Base, resolves holder-configured media, builds marketplace metadata (`image`, `animation_url`, `external_url`, attributes), parses DNA traits, caches responses, rate-limits requests and exposes a health endpoint.
- **Media-aware metadata:** Identifies image, video, audio, HTML and 3D-related formats and maps them into marketplace fields.
- **ARC-01 flagship experience** and **STANDARD / Crystal Energy Core** experience.
- **Marketplace presentation:** The collection and ARC-01 / Deed #1 are listed on OpenSea.

### Cross-Chain Media Display

The Front, Back and Video URIs set through `updateIdentity` can reference media from any chain or any project, with no restriction on source: Bitcoin-based media, Ethereum NFTs, assets from other chains, and files hosted anywhere on the internet. The system fetches and displays the referenced media. It does not verify that the holder owns the original asset and does not certify that the media is genuine. The holder chooses what to display; the Base token remains a Sovereign Protocol token with its own name and token number.

DNA and HIDDEN are separate flexible string fields configured through NOVA. They hold the holder's own identity references and route the token's metadata to the holder's own endpoint. The external service decides how any such reference is interpreted.

### Roadmap

- **Sovereignty Fleet:** Eight spacecraft are completed; two more are in the final finishing and decorative stage.
- **Expansion target:** 15 spacecraft models in total. This is a roadmap goal, not a claim that all 15 are complete.
- **Continued evolution:** Additional spacecraft identities, scenes and presentation experiences on the shared token, metadata and viewer architecture.

---

## 1. Architecture at a Glance

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

Each part has one responsibility, and together they work as one system.

- **Smart contract:** Registry of ownership and identity strings. It stores references; it does not render media.
- **Dashboard:** The user-facing interface for contract functions, identity and media references.
- **API and metadata gateway:** Reads on-chain fields and builds the metadata that marketplaces and viewers consume.
- **Irys and Arweave:** Media upload and the use of returned transaction identifiers or URLs.
- **Product viewers:** Interactive 3D experiences with optional read-only blockchain information.

---

## 2. Smart Contract — Sovereign Ownership and Dynamic Identity

| Property | Details |
|---|---|
| Contract | **SovereignInfrastructure** |
| Network | Base Mainnet (Chain ID **8453**) |
| Standard | ERC-721 |
| Collection | Sovereign Protocol (`SOV`) |
| Maximum supply | 5,555 tokens |
| Royalty | ERC-2981, 7% |
| Token-bound accounts | ERC-6551 integration |
| Metadata update signalling | EIP-4906 |
| Contract address | **0x06040F2e5301B2616491E113962A84d372b8f600** |

### 2.1 Ownership Belongs to the Holder

Sovereign separates **infrastructure administration** from **individual token ownership**.

- **Token holder:** Decides the media, identity values and metadata route for their own token.
- **Smart contract:** Enforces its encoded rules and records on-chain state. It has no function to transfer, burn, freeze or pause a holder's token.
- **Architect and operators:** Build, maintain and support the infrastructure, including the metadata gateway, the dashboard and the viewers.

A holder may choose an artwork, photograph, video, 3D model, external API, personal project or brand identity as the content for their token. The holder makes that choice; the system never selects content for them.

### 2.2 Dynamic Token Identity

| Function | Purpose |
|---|---|
| **THE_SOVEREIGN_AWAKENING** | Public minting |
| **ARCHITECT_MINT** | 300 reserved mints, given away to build awareness of the project (up to 50 per call) |
| **updateIdentity** | Updates a token's Front, Back and Video references. Owner-only, available from mint, unlimited, no contract fee |
| **THE_SOVEREIGN_NOVA** | Sets the token's DNA and HIDDEN identity values |
| **tokenURI** | Returns the token's metadata URI according to the contract's rules |
| **getDeedData** | Returns ownership, identity and related data |
| **deployTBA** / **getTBA** | Deploys / derives the ERC-6551 token-bound account |
| **setBaseURI** | Sets the Base URI that points to the metadata gateway |
| **setParams** | Sets mint, Nova and Council prices so promotions can be run |
| **setArchitect** | Changes the designated Architect address |

A token is never defined forever by its first image. The same token serves as a continuing identity container as the holder's creative work, business, brand or project evolves.

### 2.3 DNA and HIDDEN: Programmable Identity

DNA and HIDDEN are flexible string fields. The contract accepts strings; the holder decides what they mean within their own application.

Potential uses:

- Connect a token to a personal website, creator profile or brand.
- Reference a project, artwork collection or portfolio.
- Link an identity to an external API or metadata service.
- Reference URLs or records used in the holder's own verification workflow.
- Associate digital artwork with a physical-world product, brand or commercial project.
- Support a provenance, access, membership or claim workflow implemented by an external system.

For example, a creator could develop an original alien-dog character, associate it with a token, and use it across artwork, NFT media, a website, merchandise, toys and other real-world products. A business could connect a token to its own website or verification service, where the external system defines how a claim, entitlement or licence is validated.

### 2.4 Media Updates and NOVA

**`updateIdentity`** changes Front, Back and Video. It is available to the owner from mint onward, is not gated by NOVA, has no update limit and charges no contract fee. Each update is one on-chain transaction, so the holder pays only network gas.

**SOVEREIGN NOVA** is a separate operation. It records DNA and HIDDEN and routes the token's metadata to the holder's own endpoint.

> **STATUS: ABSOLUTE SOVEREIGNTY**

After Nova the token carries ABSOLUTE SOVEREIGNTY status. The Nova fee is paid once per token. Afterwards the holder can resubmit Nova at no Nova fee (network gas only) to change the values or clear them and return to the project route. Council tokens hold this status from mint.

**Pricing.** Prices are adjustable by the Architect through `setParams` for promotions. The standard mint price is **0.05 ETH**. The mint currently runs at a promotional **0.02 ETH**, and Nova is currently **0.1 ETH**. Council tokens (#111–#999 in steps of 111, and every multiple of 1111 up to #5555) are priced separately. Changes apply to new mints and new Nova activations only.

### 2.5 Two Metadata Routes

1. **Project route — Base URI and the Sovereign gateway.** The gateway reads each token's current Front, Back and Video from the chain and builds marketplace-ready metadata. This route is what makes unlimited media changes appear on marketplaces and in viewers.
2. **Holder route — `tokenURI` string.** When the token has ABSOLUTE SOVEREIGNTY and both DNA and HIDDEN are non-empty, the contract bypasses the Base URI and returns the HIDDEN string, which can be a URL or domain operated by the holder.

NOVA changes **where metadata is obtained**. It does not activate `updateIdentity`.

External APIs can provide dynamic metadata and media. If a holder's personal API becomes unavailable, the holder or service operator can restore it, change the configured URI or clear the values to return to the project route.

Linking to an image of an existing CryptoPunk, for example, does not transfer ownership of that Ethereum NFT. The Base token stays a Sovereign Protocol token with its own name and token number; the external image is only the media it displays.

### 2.6 Token Bound Accounts

ERC-6551 integration gives each token an associated account address through the configured registry and implementation. The dashboard supports inspecting the TBA address and related token information, and compatible applications can build on this account layer.

### 2.7 Design Decisions Made Before Deployment

1. **The metadata gateway exists so holders can change their media freely.** The Base URI points to the Sovereign gateway, which reads each token's current Front, Back and Video from the chain. A holder can change image, video or back media any number of times, and the new media appears in marketplaces and viewers.
2. **300 Architect mints are for giveaways.** They were reserved to build awareness of the project.
3. **Prices are adjustable for promotions.** This was designed in from the start and the marketing was planned before deployment. The mint is currently on promotion.
4. **After mint, the token belongs to the holder.** The holder decides the media, the identity values and the metadata route.

---

## 3. Infrastructure — Dashboard, API, RPC and Media Pipeline

### 3.1 The Dashboard: Pen, Media Workstation and Display

- **The pen — create and write identity.** Enter media references, DNA and HIDDEN and submit the matching contract transactions.
- **The media workstation — upload and prepare content.** Upload through the integrated Irys workflow, receive a transaction identifier, and use it in the token's identity configuration.
- **The display — present and inspect media.** Present images, video and interactive 3D, including front/back and different proportions.

The workflow: prepare media, obtain a reference, write it to the token's on-chain identity, present the result.

### 3.2 Irys and Arweave Media Workflow

The Irys integration supports a stated maximum of **500 MB per upload**.

1. Select an image, video, audio file or other supported media.
2. The dashboard sends it through the Irys integration.
3. The upload returns a transaction identifier or media reference.
4. Choose how to use the returned reference.
5. Submit the identity update transaction to the contract.
6. The dashboard or viewer presents the configured content.

A creator can upload new artwork, obtain its reference and submit it through `updateIdentity` as the Front URI, and optionally set a Back or Video reference. Uploading and updating the token are separate actions: an Irys transaction ID does not by itself change the contract.

### 3.3 API and Metadata Gateway

The gateway sits between the Base URI, the on-chain references, metadata consumers and the viewers. It:

- Reads Deed data from the Base contract through multiple RPC endpoints.
- Retrieves owner, active status, sovereignty status, Front/Back/Video, DNA, HIDDEN and TBA through `getDeedData`.
- Resolves media references and identifies supported media types.
- Builds marketplace-compatible metadata: `image`, `animation_url`, `external_url` and attributes.
- Converts DNA trait strings into metadata attributes.
- Provides response caching, request-rate limiting and a health endpoint.

This lets media be presented through marketplace metadata without the contract hosting files or rendering a 3D scene.

### 3.4 RPC-Powered HTML Products

- **Local 3D experience:** Renders in the browser with no wallet needed to view the scene.
- **Read-only blockchain information:** Uses internet access and a configured Base RPC endpoint.
- **Wallet transactions:** Require a wallet/provider flow and authorization; read-only access never signs a transaction.
- **External media:** Loaded from configured references in the formats the viewer supports.

### 3.5 Three Simultaneous Live Media Screens

The dashboard runs three screens at once, each with an OPEN FULL SCREEN button.

- **Mode 1:** the holder's Front, Back and Video as a flip card.
- **Mode 2:** the STANDARD 3D experience.
- **Mode 3:** the SPACECRAFT 3D experience for that token (Deed #1 shows ARC-01).

Supported presentation includes images, video, interactive 3D, flip-card front/back and proportions of 1:1, 9:16 and 3:4 where the viewer supports them. Running three screens at once uses more battery, memory and bandwidth, so a recent device and a good connection give the smoothest playback.

### 3.6 Holder-Controlled Operations

The dashboard covers token inspection, minting, TBA interaction, DNA and HIDDEN configuration and media identity updates. It invokes the contract's operations; authorization stays enforced by the smart contract.

---

## 4. Products — Two Connected Digital Product Families

1. **STANDARD** — Crystal Energy Core and related digital-art experiences.
2. **SPACECRAFT** — ARC-01 Sovereignty Architect Flagship and the Sovereignty Fleet.

These are creative experiences built on the ecosystem's identity and presentation capabilities.

---

## 5. STANDARD — Crystal Energy Core · Sovereign Awakening

**CRYSTAL ENERGY CORE — SOVEREIGN AWAKENING** is a real-time, browser-based 3D digital-art experience built around a luminous crystal, rotating particle rings, layered depth, lighting and ambient audio. It is distributed as a single HTML file with its principal 3D components and assets packaged inside.

- A continuously rotating three-dimensional crystal.
- Particle rings with distinct foreground and background layers.
- Lighting and bloom effects.
- Ambient audio the viewer can enable or disable.
- Audio-reactive effects that change particle and ring properties with measured sound intensity.
- Interactive camera controls.
- Read-only access to supported on-chain token information through embedded RPC configuration.

**Real-time and offline use.** The scene renders locally and needs no wallet to view or interact. The artwork renders without live RPC data; blockchain information needs internet access and a working RPC endpoint. Wallet transactions are not part of the read-only viewer.

---

## 6. SPACECRAFT — ARC-01 Sovereignty Architect Flagship & Fleet

**ARC-01** is the Sovereignty Architect Flagship: an interactive spacecraft experience in a cinematic science-fiction environment. Its visual direction combines metallic black and gold, high-contrast lighting, propulsion effects, HUD elements, planetary environments and a simulated transition through spacetime.

### The Spacetime Narrative

ARC-01 uses Einstein–Rosen bridges, wormholes, spacetime geometry and gravitational singularities as the foundation of its art direction, in five stages:

1. **Flat spacetime and sub-light cruise.** The ship cruises through a conventional environment of planets and debris with propulsion active.
2. **Plasma cannon breach and gravitational singularity.** A plasma-firing sequence creates a concentrated energy effect and a simulated spacetime disruption — the opening of a wormhole.
3. **Traversing the wormhole throat.** A tunnel of rotating energy rings, neon light and spatial distortion represents a compressed spacetime route.
4. **White-hole emergence and restabilization.** The ship emerges into a new environment, warp effects fade and flight stabilizes.
5. **New-sector calibration and reset.** A new space environment begins another cycle.

These stages are a fictional, interactive visualization inspired by theoretical physics, used as a cinematic framework.

### Interaction and Presentation

- A recognizable flagship silhouette.
- Metallic materials and high-contrast lighting.
- Multiple propulsion effects, weapon effects and HUD elements.
- Space environments and particle effects.
- Interactive flight and camera controls.
- Plasma- and warp-themed controls in the viewer interface.

### Fleet

The current lineup documents **ten distinct units**: eight completed and two in the final finishing and decorative stage.

| Unit | Designation | Spacecraft Name | Viewer Link |
|---|---|---|---|
| **UNIT #1** | **ARC-01** | **SOVEREIGNTY ARCHITECT FLAGSHIP** | [Open](https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1) |
| **UNIT #111** | **DS-01** | **SOVEREIGNTY GOLDEN DRAGON** | [Open](https://gateway.irys.xyz/GjajqvigutVM9msryzDv6e5diiYbGnE9Yi6GdiXStGLB#111) |
| **UNIT #222** | **SH-22** | **SOVEREIGNTY SHADOW BLADE** | In finishing stage |
| **UNIT #333** | **TD-33** | **SOVEREIGNTY THUNDER BLACK STAR** | In finishing stage |
| **UNIT #999** | **ARC-09** | **SOVEREIGNTY ARCHITECT FLAGSHIP WHITE STAR** | [Open](https://gateway.irys.xyz/GjajqvigutVM9msryzDv6e5diiYbGnE9Yi6GdiXStGLB) |
| **UNIT #1111** | **S-22** | **SOVEREIGNTY T-REX** | [Open](https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1#1111) |
| **UNIT #2222** | **SO-57** | **SOVEREIGNTY EAGLE** | [Open](https://gateway.irys.xyz/GjajqvigutVM9msryzDv6e5diiYbGnE9Yi6GdiXStGLB#2222) |
| **UNIT #3333** | **GT-03** | **SOVEREIGNTY PHANTOM APEX** | [Open](https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1#3333) |
| **UNIT #4444** | **PX-44** | **SOVEREIGNTY BLACK STAR PLASMA REAPER** | [Open](https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1#4444) |
| **UNIT #5555** | **TX-01** | **SOVEREIGNTY TITAN SLAYER** | [Open](https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1#5555) |

The roadmap targets **15 spacecraft models** in total; ten are documented above.

---

## 7. Product Delivery and User Experience

Three experiences that are usually separate come together here.

- **Ownership:** The contract records the token and exposes its operations.
- **Identity:** Holders configure media and identity references through owner-authorized functions.
- **Presentation:** Browser-based products display artwork, video and interactive 3D without requiring a wallet connection for ordinary viewing.

A viewer can display artwork without signing a transaction. A read-only RPC call retrieves public token information without taking custody of a wallet. An identity update requires an on-chain transaction.

---

## 8. Project Links

- **Dashboard:** https://sovereign-council.xyz
- **OpenSea Collection:** https://opensea.io/collection/sovereign-protocol
- **ARC-01 / Deed #1:** https://opensea.io/item/base/0x06040f2e5301b2616491e113962a84d372b8f600/1
- **Smart contract on BaseScan:** https://basescan.org/address/0x06040F2e5301B2616491E113962A84d372b8f600
- **Dashboard and product repository:** https://github.com/machiavelliandarkcoolempire-eng/Sovereign-absolute
- **Metadata gateway repository:** https://github.com/machiavelliandarkcoolempire-eng/fluffy-rotary-phone
- **Backend API (live):** https://fluffy-rotary-phone-bice.vercel.app/

### Product Viewer Links

- **THE IMPERIAL SOVEREIGN DEED:** https://gateway.irys.xyz/9owrLsuodwEM7DdatGkoYpmBayjDtEu6djRQceRN4KrP
- **SOVEREIGN AWAKENING (STANDARD):** https://gateway.irys.xyz/ERGZdiEvcsKCUnkGnRyTZ8Mw5uUW7Xami3NhzwN9LVex#2992

**SPACECRAFT**

- **ARC-01 Sovereignty Architect Flagship:** https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1
- **S-22 Sovereignty T-Rex (#1111):** https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1#1111
- **GT-03 Sovereignty Phantom Apex (#3333):** https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1#3333
- **PX-44 Sovereignty Black Star Plasma Reaper (#4444):** https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1#4444
- **TX-01 Sovereignty Titan Slayer (#5555):** https://gateway.irys.xyz/A3SNa932kAP2FKmYyzZnePq6zic74sK66LBaP3zr5VT1#5555
- **DS-01 Sovereignty Golden Dragon (#111):** https://gateway.irys.xyz/GjajqvigutVM9msryzDv6e5diiYbGnE9Yi6GdiXStGLB#111
- **ARC-09 Sovereignty Architect Flagship White Star (#999):** https://gateway.irys.xyz/GjajqvigutVM9msryzDv6e5diiYbGnE9Yi6GdiXStGLB
- **SO-57 Sovereignty Eagle (#2222):** https://gateway.irys.xyz/GjajqvigutVM9msryzDv6e5diiYbGnE9Yi6GdiXStGLB#2222

SH-22 Shadow Blade (#222) and TD-33 Thunder Black Star (#333) are in the finishing stage; links will be added once they are published.

### Implementation Files

- **index.html** — Sovereign dashboard and browser interface.
- **index.js** — Irys WebUploader initialization using the Ethereum adapter and Ethers v6.
- **ARC-01.html** — ARC-01 flagship 3D experience.
- **ARC-09.html** — ARC-09 White Star 3D experience.
- **SHIP_111.html**, **SHIP_1111.html**, **SHIP_2222.html**, **SHIP_3333.html**, **SHIP_4444.html**, **SHIP_5555.html** — fleet experiences.
- **SOVEREIGN_AWAKENING.html** — STANDARD / Crystal Energy Core experience.
- **SOVEREIGN_AWAKENING_onchain.html** — on-chain-aware Sovereign Awakening variant.
- **SOVEREIGN_COUNCIL.html** — Sovereign Council experience.
- [Metadata gateway index.ts](https://github.com/machiavelliandarkcoolempire-eng/fluffy-rotary-phone/blob/main/index.ts) — metadata API implementation.

---

## 9. Architectural Principles

- **Holder-directed identity.** From mint onward the holder updates Front, Back and Video through `updateIdentity`, as many times as they like, with no update limit and no contract fee. NOVA is not required.
- **Infrastructure as a service layer.** The Architect develops, maintains and supports the ecosystem. Infrastructure maintenance is distinct from ownership of any holder's token.
- **Dynamic media.** A token's presentation evolves through updated identity fields and metadata references.
- **Separation of storage, contract and presentation.** Storage holds media; the contract records ownership and the holder's references; the Base URI and gateway serve metadata; NOVA can switch `tokenURI` to a holder-specified endpoint; the viewer presents the experience.
- **Real-time digital products.** STANDARD and SPACECRAFT render in the browser; the HTML delivery model keeps them portable, and RPC adds read-only on-chain information.
- **Optional blockchain inspection.** Read-only data without a wallet connection for ordinary viewing.
- **User choice over external services.** A holder can configure external identity, media or metadata services and change them at any time.
- **Cross-chain media display.** Front, Back and Video can reference media from any chain or project without restriction. Sovereign displays it; verification, if any, belongs to the holder or an external service.

---

## 10. Project Summary

Sovereign Protocol is a connected Web3 architecture that combines:

- An ERC-721 smart contract on Base.
- Holder-controlled identity with unlimited, fee-free media updates.
- DNA and HIDDEN identity fields with optional holder-operated metadata routing through NOVA.
- ERC-6551 Token Bound Account integration.
- A multifunctional dashboard for contract operations.
- An Irys media-upload workflow with a stated 500 MB capacity.
- RPC-powered token inspection in supported viewers.
- A metadata gateway that reads Deed state and builds marketplace-compatible metadata.
- A dashboard with three simultaneous media screens, each with a full-screen option.
- STANDARD digital-art experiences, including Crystal Energy Core.
- SPACECRAFT experiences, including ARC-01 and the wider fleet.
- Cross-chain media display: media from any chain or project can be referenced and shown.

The contract provides the on-chain foundation, the dashboard gives holders an operational interface, the media infrastructure connects content to identity, and the products turn those capabilities into interactive experiences.

**The holder directs their token's identity; the contract enforces its encoded rules; and the infrastructure exists to support the holder's choices.**

**YOUR TOKEN. YOUR MEDIA. YOUR CHOICE.**
