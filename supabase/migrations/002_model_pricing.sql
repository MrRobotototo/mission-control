-- Model pricing table for dynamic cost calculation
CREATE TABLE model_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL,
  input_price_per_1m DECIMAL(10,6) NOT NULL, -- Price per 1M input tokens
  output_price_per_1m DECIMAL(10,6) NOT NULL, -- Price per 1M output tokens
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_until TIMESTAMPTZ, -- NULL = current pricing
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient lookups
CREATE INDEX idx_model_pricing_model ON model_pricing(model);
CREATE INDEX idx_model_pricing_effective ON model_pricing(effective_from, effective_until);

-- Seed current pricing (as of Feb 2026)
-- Anthropic Claude pricing
INSERT INTO model_pricing (model, input_price_per_1m, output_price_per_1m, effective_from) VALUES
  ('claude-sonnet-4-5', 3.00, 15.00, '2024-11-01'), -- Claude Sonnet 4.5
  ('claude-opus-4-6', 15.00, 75.00, '2025-01-01'), -- Claude Opus 4.6
  ('claude-haiku-4', 1.00, 5.00, '2024-11-01'); -- Claude Haiku 4

-- OpenRouter pricing (example models)
INSERT INTO model_pricing (model, input_price_per_1m, output_price_per_1m, effective_from) VALUES
  ('kimi-k2.5', 0.25, 1.00, '2025-12-01'), -- Moonshot Kimi
  ('gpt-4o', 2.50, 10.00, '2024-05-01'), -- GPT-4o
  ('gpt-4o-mini', 0.15, 0.60, '2024-07-01'); -- GPT-4o mini

-- Function to get current pricing for a model
CREATE OR REPLACE FUNCTION get_model_pricing(model_name TEXT, at_timestamp TIMESTAMPTZ DEFAULT NOW())
RETURNS TABLE(input_price DECIMAL, output_price DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT input_price_per_1m, output_price_per_1m
  FROM model_pricing
  WHERE model = model_name
    AND effective_from <= at_timestamp
    AND (effective_until IS NULL OR effective_until > at_timestamp)
  ORDER BY effective_from DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate cost for given tokens
CREATE OR REPLACE FUNCTION calculate_token_cost(
  model_name TEXT,
  input_tok INTEGER,
  output_tok INTEGER,
  at_timestamp TIMESTAMPTZ DEFAULT NOW()
)
RETURNS DECIMAL AS $$
DECLARE
  pricing RECORD;
  total_cost DECIMAL;
BEGIN
  -- Get pricing
  SELECT * INTO pricing FROM get_model_pricing(model_name, at_timestamp);
  
  -- If no pricing found, return 0
  IF pricing IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Calculate cost: (tokens / 1M) * price_per_1m
  total_cost := (input_tok::DECIMAL / 1000000.0) * pricing.input_price
              + (output_tok::DECIMAL / 1000000.0) * pricing.output_price;
  
  RETURN ROUND(total_cost, 4);
END;
$$ LANGUAGE plpgsql;

-- View for token usage with dynamically calculated costs
CREATE OR REPLACE VIEW token_usage_with_cost AS
SELECT 
  tu.*,
  calculate_token_cost(tu.model, tu.input_tokens, tu.output_tokens, tu.timestamp) AS calculated_cost
FROM token_usage tu;

-- Enable RLS on model_pricing
ALTER TABLE model_pricing ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read pricing
CREATE POLICY "Allow authenticated read on model_pricing"
  ON model_pricing FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert/update pricing (admin can restrict further)
CREATE POLICY "Allow authenticated insert on model_pricing"
  ON model_pricing FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on model_pricing"
  ON model_pricing FOR UPDATE
  TO authenticated
  USING (true);
