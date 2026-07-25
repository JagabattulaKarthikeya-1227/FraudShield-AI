export interface ShapFeature {
  name: string;
  value: number;
  contribution: number;
}

export interface BusinessExplanation {
  predictionSummary: string[];
  topPositiveFactors: string[];
  topNegativeFactors: string[];
  finalDecision: string;
  confidenceScore: string;
  recommendedAction: 'Approve' | 'Review' | 'Decline';
  analystRecommendation: string;
}

export const FEATURE_NAME_MAP: Record<string, string> = {
  'V12': 'Transaction History',
  'V17': 'Customer Location',
  'V24': 'Transaction Amount',
  'V14': 'Transaction Velocity',
  'V20': 'Merchant Risk',
  'V21': 'Device Trust Score',
  'Amount': 'Transaction Amount',
  'V10': 'Time Pattern',
  'V3': 'Merchant History'
};

export const FEATURE_REASONING_MAP: Record<string, { positive: string, negative: string }> = {
  'Transaction History': {
    positive: 'The transaction history deviates significantly from the customer\'s established baseline.',
    negative: 'Previous transaction history aligns with legitimate spending patterns, reducing the risk.'
  },
  'Customer Location': {
    positive: 'Transaction location differs considerably from previous customer locations.',
    negative: 'The transaction originates from a trusted, frequently used customer location.'
  },
  'Transaction Amount': {
    positive: 'The transaction amount is unusually high compared to the customer\'s normal spending pattern.',
    negative: 'The transaction amount falls well within the expected historical spending limits.'
  },
  'Transaction Velocity': {
    positive: 'Transaction velocity indicates multiple purchase attempts within an unusually short period.',
    negative: 'Transaction velocity is normal with no signs of automated or rapid-fire attempts.'
  },
  'Merchant Risk': {
    positive: 'The merchant category has historically shown higher fraud rates across our network.',
    negative: 'The merchant is highly trusted and rarely associated with fraudulent activity.'
  },
  'Device Trust Score': {
    positive: 'The device fingerprint is completely new and has not been seen associated with this account before.',
    negative: 'The device is recognized and verified from prior secure sessions.'
  },
  'Time Pattern': {
    positive: 'The time of the transaction is outside the customer\'s normal behavior window.',
    negative: 'The time of the transaction matches typical customer activity.'
  },
  'Merchant History': {
    positive: 'The customer has no prior history with this merchant or merchant category.',
    negative: 'The customer frequently shops with this specific merchant.'
  }
};

export function getReadableFeatureName(rawName: string): string {
  // Try exact match
  if (FEATURE_NAME_MAP[rawName]) return FEATURE_NAME_MAP[rawName];
  
  // Try extracting the VX part if it's formatted like "V17 (Location Anomaly)"
  const match = rawName.match(/^(V\d+)/);
  if (match && FEATURE_NAME_MAP[match[1]]) {
    return FEATURE_NAME_MAP[match[1]];
  }
  
  return rawName.replace(/\s*\(.*\)\s*/g, ''); // Strip parenthesis if fallback
}

export function generateExplanation(
  features: ShapFeature[], 
  probability: number
): BusinessExplanation {
  const sortedFeatures = [...features].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  
  const positiveContributors = sortedFeatures.filter(f => f.contribution > 0);
  const negativeContributors = sortedFeatures.filter(f => f.contribution <= 0);

  const topPositive = positiveContributors.slice(0, 3).map(f => getReadableFeatureName(f.name));
  const topNegative = negativeContributors.slice(0, 2).map(f => getReadableFeatureName(f.name));

  const summaryBullets: string[] = [];
  
  // Generate reasoning sentences for top contributors
  positiveContributors.slice(0, 4).forEach(f => {
    const readable = getReadableFeatureName(f.name);
    const reasoning = FEATURE_REASONING_MAP[readable]?.positive || `The ${readable} significantly increased the fraud probability.`;
    summaryBullets.push(reasoning);
  });

  if (negativeContributors.length > 0) {
    const readable = getReadableFeatureName(negativeContributors[0].name);
    summaryBullets.push(`These factors increased the fraud probability, while ${readable.toLowerCase()} slightly reduced the risk.`);
  }

  const confidencePercent = (probability * 100).toFixed(1);
  const isHighRisk = probability > 0.75;
  const isMediumRisk = probability > 0.30 && probability <= 0.75;
  
  let recommendedAction: 'Approve' | 'Review' | 'Decline';
  let finalDecision: string;
  let analystRecommendation: string;

  if (isHighRisk) {
    finalDecision = 'High Risk';
    recommendedAction = 'Decline';
    analystRecommendation = 'Immediate decline recommended. Core behavioral features indicate a high probability of account takeover or stolen credentials.';
  } else if (isMediumRisk) {
    finalDecision = 'Elevated Risk';
    recommendedAction = 'Review';
    analystRecommendation = 'Manual review required. While some signals are anomalous, they do not conclusively indicate fraud. Verify customer intent via SMS or email.';
  } else {
    finalDecision = 'Low Risk';
    recommendedAction = 'Approve';
    analystRecommendation = 'Approve transaction. Behavior perfectly aligns with historical norms.';
  }
  
  summaryBullets.push(`Overall confidence of the ensemble model is ${confidencePercent}%, therefore the transaction is classified as ${finalDecision}.`);

  return {
    predictionSummary: summaryBullets,
    topPositiveFactors: topPositive,
    topNegativeFactors: topNegative,
    finalDecision,
    confidenceScore: `${confidencePercent}%`,
    recommendedAction,
    analystRecommendation
  };
}
