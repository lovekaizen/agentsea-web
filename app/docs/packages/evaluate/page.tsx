import type { Metadata } from 'next';
import PackagePage, { type PackageDoc } from '../../../components/docs/PackagePage';
import DocSection from '../../../components/docs/DocSection';
import CodeBlock from '../../../components/docs/CodeBlock';
import { ApiList, ApiRow } from '../../../components/docs/ApiList';

export const metadata: Metadata = {
  title: '@lov3kaizen/agentsea-evaluate | AgentSea',
  description:
    'Runs an evaluation pipeline over a dataset with built-in metrics, LLM judges and preference export.',
};

const pkg: PackageDoc = {
  slug: 'evaluate',
  name: '@lov3kaizen/agentsea-evaluate',
  summary: 'Runs an evaluation pipeline over a dataset with built-in metrics, LLM judges and preference export.',
  version: '1.2.1',
  onNpm: true,
  install: 'pnpm add @lov3kaizen/agentsea-evaluate',
  example: {
    lang: 'TS',
    code: `import { EvaluationPipeline, Accuracy, Relevance, EvalDataset } from '@lov3kaizen/agentsea-evaluate';

const pipeline = new EvaluationPipeline({
  metrics: [new Accuracy({ type: 'fuzzy' }), new Relevance()],
  parallelism: 5,
});
const dataset = new EvalDataset({
  items: [
    { id: '1', input: 'What is the capital of France?', expectedOutput: 'Paris' },
    { id: '2', input: 'What is 2 + 2?', expectedOutput: '4' },
  ],
});
const results = await pipeline.evaluate({ dataset, generateFn: async (input) => await myAgent.run(input) });
console.log(results.summary);`,
  },
  api: [
    {
      name: 'EvaluationPipeline.evaluate({ dataset, generateFn })',
      description: 'Runs the metrics over each dataset item and returns a summary.',
    },
    { name: 'Accuracy({ type })', description: 'Scores exact or fuzzy matches against the expected output.' },
    { name: 'RubricJudge({ provider, rubric })', description: 'Scores a response against a rubric on a 1 to 5 scale.' },
    {
      name: 'ComparativeJudge.compare({ input, responseA, responseB })',
      description: 'Returns the winning response.',
    },
    {
      name: 'EvalDataset.filter / sample(count) / split(ratio)',
      description: 'Selects or splits dataset items.',
    },
  ],
  caveats: [
    'HuggingFace import reads the public datasets-server API. It sends HF_TOKEN for gated datasets. HuggingFace export needs the optional @huggingface/hub package and a write-scoped token.',
    'Semantic accuracy falls back to fuzzy matching until embeddings are configured.',
    'Toxicity uses regex patterns, not a model.',
    'RubricJudge and ComparativeJudge need an LLM provider. Scoring methods for Coherence, Relevance and Faithfulness are not described.',
  ],
};

const toc = [
  { id: 'judges', label: 'LLM judges' },
  { id: 'datasets', label: 'Datasets and Hugging Face' },
  { id: 'alerts', label: 'Quality alerts' },
  { id: 'feedback', label: 'Human feedback' },
];

export default function Page() {
  return (
    <PackagePage pkg={pkg} extraToc={toc}>
      <DocSection id="judges" num="05" title="LLM judges">
        <p className="text-base leading-relaxed text-brand-navy">
          A judge asks an LLM to score a response. <code>RubricJudge</code> scores one response against criteria you write.{' '}
          <code>ComparativeJudge</code> picks the better of two responses.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { RubricJudge, ComparativeJudge } from '@lov3kaizen/agentsea-evaluate';

const judge = new RubricJudge({
  provider: anthropicProvider, // an LLM provider object you create
  rubric: {
    criteria: 'Response Quality',
    levels: [
      { score: 1, description: 'Poor: incorrect or irrelevant' },
      { score: 3, description: 'Good: correct but incomplete' },
      { score: 5, description: 'Excellent: correct, complete and well explained' },
    ],
  },
});
const comparison = new ComparativeJudge({ provider: openaiProvider, criteria: ['accuracy', 'helpfulness', 'clarity'] });
const winner = await comparison.compare({ input: 'Summarize this article', responseA: modelAOutput, responseB: modelBOutput });`}
        />
      </DocSection>

      <DocSection id="datasets" num="06" title="Datasets and Hugging Face">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>EvalDataset</code> can be filtered, sampled and split. <code>EvalDataset.fromHuggingFace</code> loads rows from a public dataset on the HuggingFace Hub.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { EvalDataset } from '@lov3kaizen/agentsea-evaluate';

const dataset = await EvalDataset.fromHuggingFace('squad', {
  split: 'validation',
  subset: 'default',
  inputField: 'question',
  outputField: 'answers',
  contextField: 'context',
  limit: 1000,
});
const [train, test] = dataset.split(0.8);`}
        />
      </DocSection>

      <DocSection id="alerts" num="07" title="Quality alerts">
        <p className="text-base leading-relaxed text-brand-navy">
          <code>AlertManager</code> is in the <code>/continuous</code> subpath. Give it a rule for each metric and one or more channels. Each time you feed it a value, it fires the channels when a rule is breached.
        </p>
        <CodeBlock
          lang="TS"
          code={`import { AlertManager } from '@lov3kaizen/agentsea-evaluate/continuous';

const alerts = new AlertManager({
  rules: {
    accuracy: { metric: 'accuracy', threshold: 0.8, direction: 'below', severity: 'critical' },
  },
  cooldownMs: 300000, // suppress repeats for 5 minutes
  channels: [{ type: 'slack', webhook: process.env.SLACK_WEBHOOK_URL! }],
});

alerts.check('accuracy', 0.74);`}
        />
        <ApiList>
          <ApiRow name="slack / webhook">Posts the alert to a URL.</ApiRow>
          <ApiRow name="email">Sends the alert over SMTP. It needs the optional nodemailer package and a list of recipients.</ApiRow>
          <ApiRow name="pagerduty">Opens an incident through the PagerDuty Events API v2, using a routing key.</ApiRow>
        </ApiList>
      </DocSection>

      <DocSection id="feedback" num="08" title="Human feedback">
        <p className="text-base leading-relaxed text-brand-navy">
          Import <code>RatingCollector</code> and <code>PreferenceCollector</code> from <code>@lov3kaizen/agentsea-evaluate/feedback</code>. Ratings score a response on named criteria. Preferences record which of two responses an annotator chose.
        </p>
      </DocSection>
    </PackagePage>
  );
}
