import { NextResponse } from 'next/server';
import { createVlayerClient, preverifyEmail } from "@vlayer/sdk";
import proverSpec from "./EmailDomainProver.json";
import verifierSpec from "./EmailDomainVerifier.json";
// import {
//   createContext,
//   deployVlayerContracts,
//   getConfig,
// } from "@vlayer/sdk/config";
import { optimismSepolia } from "viem/chains";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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
    
    --00000000000016fe39062e9225db--`.replace(/\n/g, '\r\n')
    
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
    return NextResponse.json({
      success: true,
      message: 'Request processed successfully',
      data: body
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing request',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
