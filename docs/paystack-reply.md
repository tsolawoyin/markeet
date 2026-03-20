# Reply to Paystack — Split Payments & Business Information

**Date:** March 2026
**To:** Oluwatobi, Paystack
**Subject:** Re: Split Payments recommendation & business information update

---

Hello Oluwatobi,

Thank you for your response and for pointing us toward the Split Payments feature. We appreciate the guidance.

We've reviewed the Split Payments documentation and we're open to restructuring our payment flow to align with Paystack's requirements. However, we'd like to clarify a few things to ensure we can still protect both buyers and sellers on our platform.

## Our Core Concern

Markeet is a peer-to-peer marketplace for University of Ibadan students. Our current model holds payment until the buyer confirms delivery — this protects buyers from paying for items they never receive, and protects sellers by guaranteeing payment once delivery is confirmed. Simply splitting payment at the point of transaction would remove this buyer protection, which is central to building trust on the platform.

## Questions on Split Payments

1. Can we use Split Payments with **delayed settlement** on the seller's subaccount? For example, could the seller's share be held by Paystack until we send an API call to release it after the buyer confirms delivery?

2. Does Paystack support **controlled payouts via the Transfers API** as an alternative — where we collect the full payment, and then initiate a transfer to the seller only after delivery is confirmed?

3. Is there a way to configure a subaccount with a **settlement schedule** that we can trigger manually rather than automatically?

We want to comply fully with Paystack's policies while still maintaining transaction safety for our users. We're happy to adjust our integration approach based on your recommendations.

Regarding the business information update — could you please clarify what specific information still needs to be updated? We'd like to resolve this promptly.

Best regards,
Tsolawoyin
Markeet
