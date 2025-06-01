'use client';
import { ISuccessResult, MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import React, { useRef, useState } from 'react';
import { createWalletClient, parseAbiParameters, http, parseEther, createPublicClient, Account } from 'viem';
import { decodeAbiParameters } from 'viem';
import abi2 from './Transaction/ItemManager.json';
import { privateKeyToAccount } from 'viem/accounts';
import { worldchain } from 'viem/chains';
import { createVlayerClient, preverifyEmail } from "@vlayer/sdk";
import proverSpec from "./EmailDomainProver.json";
import verifierSpec from "./EmailDomainVerifier.json";
// import {
//   createContext,
//   deployVlayerContracts,
//   getConfig,
// } from "@vlayer/sdk/config";
import { optimismSepolia } from "viem/chains";

const categories = [
  '',
  'Electronics',
  'Fashion',
  'Books',
  'Home',
  'Sports',
  'Other',
];

export default function AddOfferScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setReceipt(file);
  };

  const connectWallet2 = async () => {
    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: '12344566787',
      statement: 'Sign in to access the Mini App',
    });
  }

  const handleVerify = async () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1200);
  };

  const addMockItem = async (title: string, description: string, category: string, timestamp: number, price: number, originalPrice: number, author: string) => {
    const { finalPayload: authPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: '12344566787',
      statement: 'Sign in to access the Mini App',
    });
   
    const { finalPayload } = await MiniKit.commandsAsync.verify({
      action: 'test-action', // Make sure to create this in the developer portal -> incognito actions
      verification_level: VerificationLevel.Orb,
      signal: MiniKit.user.walletAddress,
    });

    const proof = finalPayload as ISuccessResult;



    console.log("address", MiniKit.user.walletAddress);

    const result = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: abi2,
          functionName: 'addItem',
          args: [
            title,
            author,
            BigInt(originalPrice * 1000000000000000000),
            BigInt(price * 1000000000000000000),
            description,
            BigInt(proof!.merkle_root),
            BigInt(proof!.nullifier_hash),
            decodeAbiParameters(
              parseAbiParameters('uint256[8]'),
              proof!.proof as `0x${string}`
            )[0]
          ],
        },
      ],
    })

    console.log("result", result);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get all form data
    const formData = {
      title,
      description,
      category,
      image,
      receipt,
      verified,
      price,
      originalPrice
    };

    console.log("formData", formData);
    // TODO: Add your form submission logic here

    await addMockItem(title, description, category, 0, price, originalPrice, MiniKit.user.walletAddress || '');
  };

  const proveEmail = async () => {
    const mimeEmail = `Return-Path: <artur@vlayer.xyz>
    Received: from mail-wm1-f51.google.com (mail-wm1-f51.google.com [209.85.128.51])
     by inbound-smtp.us-east-2.amazonaws.com with SMTP id vm1p3c6jenrgbr944ldf0ljraep1ndp19hbclt01
     for 7921e0d1-e3e1-4422-9636-70dd8cb95245@proving.vlayer.xyz;
     Thu, 20 Feb 2025 12:38:04 +0000 (UTC)
    X-SES-Spam-Verdict: FAIL
    X-SES-Virus-Verdict: PASS
    Received-SPF: pass (spfCheck: domain of vlayer.xyz designates 209.85.128.51 as permitted sender) client-ip=209.85.128.51; envelope-from=artur@vlayer.xyz; helo=mail-wm1-f51.google.com;
    Authentication-Results: amazonses.com;
     spf=pass (spfCheck: domain of vlayer.xyz designates 209.85.128.51 as permitted sender) client-ip=209.85.128.51; envelope-from=artur@vlayer.xyz; helo=mail-wm1-f51.google.com;
     dkim=pass header.i=@vlayer.xyz;
     dmarc=pass header.from=vlayer.xyz;
    X-SES-RECEIPT: AEFBQUFBQUFBQUFGMXNOUldBMU96UGRiYk03NmlXWE5pTVZEVUhlQktPdGV0UFFHeHZ6YzJnVmtwWjJINFZGTUN1cTZhRTBoakM5bVBhd012UFNta3ViWDVVK3d4aldEdmJpZmIyRlpHVUZuZFNET0JxNmFEallSZXYyMDhodmlMa0xIUTR6TGczdy8xNldqeDZXc0o2cWpNWFlVMFRSZlc5c1gzaDJReW8zRVF0NnJGYVZpZDZ4WCt4SjFzVDlmWGxqc214UjIrdVJYRUp1S1MrTjhaWmhPR3J4ZWdiMjRnZExST2RwZFMrWCt1bWRadVp6RGx4bGNOcW45QWgvWW9GZ2lRK2FrUXhUN0JTdEpuQnBEblN2V21MTVAxcUErMzl5N01LU1R1Y2FkdzFFN2t5Y3c4c0E9PQ==
    X-SES-DKIM-SIGNATURE: a=rsa-sha256; q=dns/txt; b=WemofLXoBxooRxJsFIbzg3ZPygWckEycRik2bNwcE7JT+gXw5rIYkudJMEZoV7NgYpQpJw28R81GTxbmYriPM+p4Ql+5XLVSB52FUboCyqlXz4B6O/lFK3B39OOH4SecbHrac8XgxDMf6MDX6/dtlMlu2B0D8PPhWNma36Y4blQ=; c=relaxed/simple; s=xplzuhjr4seloozmmorg6obznvt7ijlt; d=amazonses.com; t=1740055085; v=1; bh=ZhcNAhpOtSJL6zWNKLSprRJZeloGBBrDShzfzlBgc0M=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;
    Received: by mail-wm1-f51.google.com with SMTP id 5b1f17b1804b1-43994ef3872so5061475e9.2
            for <7921e0d1-e3e1-4422-9636-70dd8cb95245@proving.vlayer.xyz>; Thu, 20 Feb 2025 04:38:04 -0800 (PST)
    DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
            d=vlayer.xyz; s=google; t=1740055082; x=1740659882; darn=proving.vlayer.xyz;
            h=to:subject:message-id:date:from:mime-version:from:to:cc:subject
             :date:message-id:reply-to;
            bh=ZhcNAhpOtSJL6zWNKLSprRJZeloGBBrDShzfzlBgc0M=;
            b=F2W/iBAmmSZA+OncqRutYON6srl97A0apK9Ixc0AfXNllhEE7uzJk5+pl0EAKfeAgp
             fLbOWX9nHdr2TjT2wE1Wge27imZWrJ8d6PIdTNnrIgY7dBMtXLRpT6Swu8/hfq7fa2O3
             rYH9R80IZSFf5fGPmVxbLReV8BweMgdpr5lp4Sf/JUTaRYr+IlwYJCPvxIVDAmPEm6Un
             +hMC9JHoPYDK0Y5cPHKMnUfNQUMTNxOLj2urhe7ahG64SF9DgYOsbO75Lug5FfcYxON3
             4P0VwXGSM9Mow3AI3z89TqCaytCINNoTpNf/BhxkQDbpcspPxbfw9LUuFddhi5Hrz2n8
             tSBw==
    X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
            d=1e100.net; s=20230601; t=1740055082; x=1740659882;
            h=to:subject:message-id:date:from:mime-version:x-gm-message-state
             :from:to:cc:subject:date:message-id:reply-to;
            bh=ZhcNAhpOtSJL6zWNKLSprRJZeloGBBrDShzfzlBgc0M=;
            b=HFX9W/ZmRkd/dLQccWYVAguoHloeyI1fJ9Otogjd4+FaWGJfxHpWGsL5R6j19saUao
             wHf5Ye08aOSc3+1UIQF4ZFWdD9T+BnYklRIoR8KGs2ml7niZXm1GpKcM0WD5maVKj/Cm
             3h/lgIItVtVsZHFfuvRoSa36+kpEXxq7fbV5UFXZg9bEtxP+7FGII3pmhwMaWjSrsjq4
             Q1VH9CTxm8SVCQxCSUAnzq7UNJa+dCUhbhLFWsAEGnVQTkjFtQm+4xEvUyd/fOEwFdMC
             QupqnCgeIOxomqzu4JaOKdwfr8srpPK0MIW6Kf6R8SyYCb9uALI5WenaAqjPznRHoLxS
             ASTg==
    X-Gm-Message-State: AOJu0YyvM78PoZb6ldEnSwNQ1KHUnMSLX0tytQTk+pSOL0Sc8wYozkdx
      FI1+rMBvTLmenu88RhbFcx/Lvoz3Z8NZKKqLdlsxnMbFWJrSCbqmYM/cgonMdPqbBozbx/6S54A
      Iu9B3JqJ+Hema75Tzz5DIgjV6WHRUw1xEm2Oo0wdNau+npHb7CYTvdA==
    X-Gm-Gg: ASbGncuy2tUTRgqEuJY+mIsIWaCg7mgo/SigktBV6gTOMGioW2jfT5PQLU3z9GcnDoh
      3pA1aZMMHNZNeHaUogQWZIqmDz5x25iLV1W5eUWkFj+Dkc8zeLRmm4xONO60+JnZG5hIp4Rp6Ir
      DhlaahJFAdE4qFtCzcDhdi0EpOXboXJQ==
    X-Google-Smtp-Source: AGHT+IEEgA1Fl4tabVJsNPfV4EoC/lokBL1ZbJ/n0/yjgv+DCe/QnJqH/b3Adqg6ujkPoyKHdyrUASDkTSKh5ThtfVQ=
    X-Received: by 2002:a05:600c:1c83:b0:439:9828:c44b with SMTP id
     5b1f17b1804b1-4399828c601mr94739135e9.14.1740055082620; Thu, 20 Feb 2025
     04:38:02 -0800 (PST)
    MIME-Version: 1.0
    From: Artur Chmaro <artur@vlayer.xyz>
    Date: Thu, 20 Feb 2025 13:37:50 +0100
    X-Gm-Features: AWEUYZlurfcd1kR0Kqhp6pj4jjmASoepF-BmhTlrQVsZWOmoRQP8Qe0W3deFvgA
    Message-ID: <CAGp8hgAkJ5KoHVmLHUxuyrCGKAvmcigt5pYqmHi6t56udzRuEg@mail.gmail.com>
    Subject: Mint my domain NFT at address: 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
    To: 7921e0d1-e3e1-4422-9636-70dd8cb95245@proving.vlayer.xyz
    Content-Type: multipart/alternative; boundary="00000000000016fe39062e9225db"
    
    --00000000000016fe39062e9225db
    Content-Type: text/plain; charset="UTF-8"
    
    
    
    --00000000000016fe39062e9225db
    Content-Type: text/html; charset="UTF-8"
    
    <div dir="ltr"><br></div>
    
    --00000000000016fe39062e9225db--`

    console.log("mimeEmail", mimeEmail);
    
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZpcm9ubWVudCI6InRlc3QiLCJpYXQiOjE3NDg3MzE3OTQsImV4cCI6MTc4MDM1NDE5NCwic3ViIjoiNzNxSEJ0dUlUQzJGcW5UQm5Jdk50eEtveFRNbEJEeFp2cDBzTjA2bGxrSTNTeUJxMU9hRTl2aWxJUDdwVHNqcnhKQ28wSDd3bVBlakIyNXlBZFRGVWc9PSJ9.Dnw-UwMqBA3cmoBY-wBwwhVPBXo2bKfLs1L7FnqFrb5rEBFXfOYcDRrrtXFVIfkB8ah3Dw68qIOOEW3dTSiBwfo5io7xUcKOK95MCKkt0CzN3DMGPO2C6bhF0uHIdpXwUa_7DT0dazbor-wIBcjjFXNm8zeaNp-_6wDmBu6djliRdWjyJxiVS_ziI2b7cPqT0OXfK4c7O6cDGbicK64TX-OcAqVxdzHQZe9b7wUf18NpD2xCrkp5mHYy410AtQE4Su5fUutaWdQ-aoA3yv-N-v8SwL11oWytqsZidyFmxIwKpyGHO12C3rW0hE6Fp3hcvApIsIfzM8UfRYnIrWDeWijYo_wIxFDu96JszCXvx_NIZEbaYtwVTxYFcJgs4oTHjPZ3YECBByzcZCmXfu4qHCN8oSv9PrngWmYfES9dPr9fgn0zy2sCUW3JOXNL4llnc_jR9YF-OpI7XamlaXVEP2kp01ITqxdn2iublWT2p3tfZRL7sdhw6nl63Kapi5pllpGlzduPJKs-HQmETLrk8unU1TV5g884Yyq8OE-gRr8ULAqpiU9D1IMrEQnlz4a64c3ovKAsVW1vKiACafnUiZoVaf61c7-BZ_WtH_1SX-KS72VaSlsZwHszUD-KxA6em9SWKAki29ZQ-3PDKkhQEFsQE8jLUxpov5fKVu5Yl1M"
    const gasLimit = 1000000;
    const john = privateKeyToAccount('0x370668dd317fff01b9ea05afef14ab02019fe54e80b24fa9edc43c5f21de6d32') as Account;
    const publicClient = createPublicClient({
      chain: optimismSepolia,
      transport: http('https://sepolia.optimism.io')
    });
    const walletClient = createWalletClient({
      account: john,
      transport: http('https://sepolia.optimism.io')
    });
    const proverUrl = "https://stable-fake-prover.vlayer.xyz";
    const dnsServiceUrl = "https://test-dns.vlayer.xyz/dns-query";
    const confirmations = 6;
    
    
    if (!john) {
      throw new Error(
        "No account found make sure EXAMPLES_TEST_PRIVATE_KEY is set in your environment variables",
      );
    }
    
    // const { prover, verifier } = await deployVlayerContracts({
    //   proverSpec,
    //   verifierSpec,
    //   proverArgs: [],
    //   verifierArgs: [],
    // });
    const prover = "0x6b20CCA18e654acc8A4551FAaDC557baFCeBF0b7";
    const verifier = "0x7A67deb8682247Ea92818A200F3406eeBB5f8B7d";
    
    if (!dnsServiceUrl) {
      throw new Error("DNS service URL is not set");
    }
    
    console.log("Proving...");
    const vlayer = createVlayerClient({
      url: proverUrl,
      token: token,
    });
    const hash = await vlayer.prove({
      address: prover,
      proverAbi: proverSpec.abi,
      functionName: "main",
      chainId: 11155420,
      gasLimit: gasLimit,
      args: [
        await preverifyEmail({
          mimeEmail,
          dnsResolverUrl: dnsServiceUrl,
          token: token,
        }),
      ],
    });
    const result = await vlayer.waitForProvingResult({ hash }) as readonly unknown[];
    
    console.log("Verifying...", verifier);
    
    // Workaround for viem estimating gas with `latest` block causing future block assumptions to fail on slower chains like mainnet/sepolia
    const gas = await publicClient.estimateContractGas({
      address: verifier,
      abi: verifierSpec.abi,
      functionName: "verify",
      args: result,
      account: john,
      blockTag: "pending",
    });
    
    const verificationHash = await walletClient.writeContract({
      address: verifier,
      abi: verifierSpec.abi,
      functionName: "verify",
      args: result,
      account: john,
      gas,
      chain: optimismSepolia,
    });
    
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: verificationHash,
      confirmations,
      retryCount: 60,
      retryDelay: 1000,
    });
    
    console.log(`Verification result: ${receipt.status}`);
  }


  const createTestTransaction = async () => {
    const account = privateKeyToAccount('0x370668dd317fff01b9ea05afef14ab02019fe54e80b24fa9edc43c5f21de6d32');
    const client = createWalletClient({
      account,
      chain: worldchain,
      transport: http('https://worldchain-mainnet.g.alchemy.com/public')
    });

    const targetAddress = '0x7565AA576EF1d9590ea258099e4Fbc1360aB71e6';
    const calldata = '0x977aa54bdeafbeef00000000000000000000000000000000000000000000000000000000d739c5c583718812855c9519f563c4874100eeadf3a2a81124548c875226cb2600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001dcb00648ecc90d8bfe92aa8d51061beb0bcb110d274fc4a517e526574233d36b000000000000000000000000000000000000000000000000000000000000036000000000000000000000000012533b0c086fe13eab2be229bd1403963f7780f0ac6981e5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aa37dc0000000000000000000000000000000000000000000000000000000001b24879e8998ff927d1f1469ece9176baf2cb2166f6d91e22cc4fc11be89a25a35e204c86214837d42007992a42336dc640e70529eba8f235b3e14f85f2a98db0e19f070000000000000000000000000f6652c713a946a80e519793b339a3bc897730c300000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000009676d61696c2e636f6d0000000000000000000000000000000000000000000000';

    try {
      const hash = await client.sendTransaction({
        to: targetAddress as `0x${string}`,
        data: calldata as `0x${string}`,
        value: parseEther('0'),
        gas: BigInt(5000000), // Using BigInt constructor instead of literal
      });
        
      console.log('Transaction sent! Hash:', hash);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <button onClick={connectWallet2}>Connect Wallet 2</button>
      <button onClick={createTestTransaction}>Create Test Transaction</button>
      <button onClick={proveEmail}>Prove Email</button>
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 flex items-center px-4 py-4 mb-4">
        <button className="mr-2 p-2 rounded-full hover:bg-gray-100 transition">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Add New Offer</h2>
      </header>
      <form className="max-w-md mx-auto space-y-4 px-4" onSubmit={handleSubmit}>
        {/* Product Image */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
          <label className="block font-extrabold text-lg mb-3">Product Image</label>
          <div
            className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 mb-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <img src={image} alt="Product" className="object-cover w-full h-full rounded-2xl" />
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="rounded-full border-2 border-gray-300 bg-white p-2 mb-2">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 16v-4M12 8h.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="#6b7280" strokeWidth="2"/></svg>
                  </div>
                  <span className="text-base font-medium text-gray-400">Tap to upload image</span>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </section>
        
        {/* Product Details */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
          <label className="block font-extrabold text-lg mb-3">Product Details</label>
          <div className="mb-3">
            <label className="block font-bold mb-1">Product Title</label>
            <input 
              type="text" 
              placeholder="Enter product title" 
              className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 placeholder:text-gray-300" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block font-bold mb-1">Description</label>
            <textarea 
              placeholder="Describe your product" 
              className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 placeholder:text-gray-300" 
              rows={3} 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block font-bold mb-1">Category</label>
            <div className="relative">
              <select
                className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 appearance-none pr-10 text-gray-700"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => <option key={cat} value={cat} disabled={cat === ''}>{cat === '' ? 'Select category' : cat}</option>)}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
        </section>
        
        {/* Pricing Information */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
          <label className="block font-extrabold text-lg mb-3">Pricing Information</label>
          <div className="flex gap-4 mb-3">
            <div className="flex-1">
              <label className="block font-bold mb-1">Current Price</label>
              <input 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 placeholder:text-gray-300" 
                required 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="block font-bold mb-1">Original Price</label>
              <input 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 placeholder:text-gray-300" 
                required 
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mb-0">
            <label className="block font-bold mb-1">Purchase Date</label>
            <input type="date" className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50" required />
          </div>
        </section>
        
        {/* Receipt Verification */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 mb-4">
          <label className="block font-extrabold text-lg mb-3">Receipt Verification</label>
          <div
            className="w-full rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 mb-4 cursor-pointer bg-gray-50 py-4 hover:bg-gray-100 transition"
            onClick={() => receiptInputRef.current?.click()}
          >
            <div className="rounded-full border-2 border-gray-300 bg-white p-1 mb-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 16v-4M12 8h.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/><rect x="3" y="5" width="18" height="14" rx="2" stroke="#6b7280" strokeWidth="2"/><path d="M3 7l9 6 9-6" stroke="#6b7280" strokeWidth="2"/></svg>
            </div>
            <span className="text-sm font-medium text-gray-400">Upload email receipt (.eml)</span>
            <input
              ref={receiptInputRef}
              type="file"
              accept=".eml"
              className="hidden"
              onChange={handleReceiptChange}
            />
            {receipt && <span className="text-xs text-gray-600 mt-1">{receipt.name}</span>}
          </div>
          <button
            type="button"
            className={`w-full mb-2 py-3 rounded-xl font-bold text-white text-lg shadow-md transition ${verifying ? 'bg-gray-300' : verified ? 'bg-green-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'}`}
            onClick={handleVerify}
            disabled={verifying || verified}
          >
            {verifying ? 'Verifying...' : verified ? 'Verified!' : 'Verify Receipt'}
          </button>
        </section>
        
        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-bold text-lg shadow-md hover:bg-gray-700 transition"
          onClick={handleSubmit}
        >
          Create Offer
        </button>
      </form>
    </div>
  );
}