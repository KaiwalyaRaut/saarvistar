import { NextRequest } from 'next/server';
import { anthropic, SYSTEM_PROMPT } from '@/lib/llm';

export const runtime = 'nodejs';

// Pre-crafted responses for realistic offline/demo streaming per format
const simulatedTransformations: Record<string, string> = {
  'exec-summary': `### Executive Summary: High-Level Resilience Directive

**Strategic Highlights**
- Perimeter exposure expanded 42% toward edge integrations and microservice endpoints during recent quarters.
- Third-party supply chain integrations remain the primary vector for credential vulnerability.
- Autonomous algorithmic containment reduced Mean Time to Containment (MTTC) by 68%.

**01 Core Findings & Risk Synthesis**
The aggregate organizational attack surface expanded significantly, driven by accelerated edge deployment and multi-region cloud interconnects. While centralized security telemetry remains solid, distributed cluster egress policies exhibited divergence from stated zero-trust baselines.

Strategic priorities must enforce automated token lifecycles and immediate revocation protocols for stale or grandfathered OAuth credentials.`,

  'advisory': `### Public Security Advisory: Edge Ingress & Token Mandate

**Incident Scope & Perimeter Assessment**
During routine operational observability audits, automated sensors detected anomalous ingress probing targeting legacy API gateways. Core customer encrypted datastores and database clusters remained completely uncompromised.

**Technical Scope & Containment**
- **Adversary Technique:** Synthetic credential cycling and dormant OAuth API token harvesting.
- **Blast Radius:** Restricted to external load balancer logs; internal application tiers remained isolated.
- **Remediation:** Enforced automated 12-hour token rotation and revoked all inactive tokens across the ecosystem within 42 minutes.`,

  'linkedin': `The modern enterprise attack surface does not expand uniformly.

It expands wherever architectural agility collides with legacy governance assumptions.

In our latest cyber resilience synthesis, one metric stood out with startling clarity:

👉 42% of posture vulnerabilities originated from edge integrations and grandfathered third-party SaaS connectors—not central cloud perimeter gaps.

While centralized clouds get 90% of the audit budget, edge endpoints often run on token privileges granted 18 months ago and forgotten.

Here are 3 realities leadership must confront before Q4 closes:
1️⃣ Static credentials are technical debt.
2️⃣ Autonomous containment beats human escalation (slashing MTTC by 68%).
3️⃣ Third-party vendor hygiene is systemic.

Resilience in 2025 isn't about thicker perimeter walls—it's about relentless zero-trust visibility at the outermost boundaries.

What baseline security assumption is your team auditing before year-end?

#ExecutiveLeadership #CyberSecurity #TechStrategy #EnterpriseRisk #CISO`,

  'twitter': `TWEET_1: 42% of enterprise vulnerabilities in Q3 didn't come from phishing or ransomware.

They came from neglected edge integrations and stale API tokens.

Here is the tactical breakdown modern CISO teams need before Q4 ends: 🧵👇
---
TWEET_2: Legacy OAuth flows are the quietest threat vector in 2024.

Adversaries aren't brute-forcing hardened perimeter firewalls anymore. They're simply walking through third-party SaaS connectors issued 18 months ago with permanent permissions.
---
TWEET_3: When lateral movement happens at the edge, human triage is too slow.

In Q3 benchmark data: Autonomous algorithmic orchestration slashed Mean Time to Containment (MTTC) by 68%.

Manual triage is now a competitive liability.
---
TWEET_4: Immediate defensive checklist for this week:

• Cap all external API SaaS tokens to 12-hr rotation.
• Restrict cluster egress strictly to whitelisted destinations.
• Revoke inactive multi-tenant integrations immediately.
---
TWEET_5: Your resilience baseline is defined by your outermost edge, not your innermost vault.

Full Strategic Cyber Resilience Advisory is published. Read & share to safeguard your architecture.

🔁 Repost if this helps your roadmap.`,
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, formatId, formatName, sourceDocName } = await req.json();

    const encoder = new TextEncoder();

    // 1. If Anthropic API key is configured, stream from Claude
    if (anthropic && process.env.ANTHROPIC_API_KEY) {
      try {
        const stream = await anthropic.messages.stream({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: `Source Document: ${sourceDocName || 'Strategy & Resilience Overview'}\nTarget Format: ${formatName || formatId}\nUser Directive: ${prompt || 'Transform source into requested format.'}`,
            },
          ],
        });

        const readableStream = new ReadableStream({
          async start(controller) {
            for await (const chunk of stream) {
              if (
                chunk.type === 'content_block_delta' &&
                chunk.delta.type === 'text_delta'
              ) {
                controller.enqueue(encoder.encode(chunk.delta.text));
              }
            }
            controller.close();
          },
        });

        return new Response(readableStream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
          },
        });
      } catch (err: any) {
        console.error('Anthropic API streaming error, falling back to simulated stream:', err);
      }
    }

    // 2. High-fidelity simulated stream fallback
    const templateText =
      simulatedTransformations[formatId] ||
      `### ${formatName || 'Intelligence Synthesis'}\n\nAutomated synthesis derived from "${sourceDocName || 'Source Document'}":\n\n${prompt ? `Directives applied: ${prompt}\n\n` : ''}Key architectural parameters verified. Strategic alignment confirmed with zero anomalous deviations. Continuous telemetry monitoring active across all enterprise edge pipelines.`;

    const words = templateText.split(' ');

    const simulatedStream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i === words.length - 1 ? '' : ' ');
          controller.enqueue(encoder.encode(word));
          // Natural stream pace
          await new Promise((res) => setTimeout(res, 22));
        }
        controller.close();
      },
    });

    return new Response(simulatedStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Generate route error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process generation request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
