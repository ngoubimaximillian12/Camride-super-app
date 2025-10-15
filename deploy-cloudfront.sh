#!/bin/bash
set -e

BUCKET_NAME="camride-frontend-1759656492"
REGION="us-east-1"

DISTRIBUTION_ID=$(aws cloudfront create-distribution \
  --origin-domain-name $BUCKET_NAME.s3.$REGION.amazonaws.com \
  --default-root-object index.html \
  --query 'Distribution.Id' \
  --output text)

echo "CloudFront Distribution Created: $DISTRIBUTION_ID"
echo "Wait a few minutes for deployment, then access at:"
aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text
