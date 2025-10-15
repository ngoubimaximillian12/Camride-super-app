#!/bin/bash
set -e

REGION="us-east-1"
FUNCTION_NAME="camride-backend"
ROLE_NAME="camrideLambdaRole"

echo "Creating IAM Role..."
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/dev/null || echo "")

if [ -z "$ROLE_ARN" ]; then
    aws iam create-role --role-name $ROLE_NAME \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "lambda.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }' > /dev/null
    
    aws iam attach-role-policy --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
    echo "Role created: $ROLE_ARN"
    sleep 10
else
    echo "Role exists: $ROLE_ARN"
fi

echo "Creating Lambda..."
cd backend
rm -rf lambda-deploy
mkdir -p lambda-deploy
cp -r src/* lambda-deploy/
cp package*.json lambda-deploy/
cd lambda-deploy
npm install --omit=dev
zip -r ../lambda.zip .
cd ..

aws lambda create-function \
    --function-name $FUNCTION_NAME \
    --runtime nodejs20.x \
    --role $ROLE_ARN \
    --handler server.handler \
    --zip-file fileb://lambda.zip \
    --timeout 30 \
    --region $REGION 2>/dev/null || \
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://lambda.zip \
    --region $REGION

cd ..

echo "Creating API Gateway..."
API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='camride-api'].ApiId" --output text)

if [ -z "$API_ID" ]; then
    API_ID=$(aws apigatewayv2 create-api \
        --name camride-api \
        --protocol-type HTTP \
        --query 'ApiId' \
        --output text)
fi

INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id $API_ID --query 'Items[0].IntegrationId' --output text 2>/dev/null || echo "")

if [ -z "$INTEGRATION_ID" ] || [ "$INTEGRATION_ID" == "None" ]; then
    INTEGRATION_ID=$(aws apigatewayv2 create-integration \
        --api-id $API_ID \
        --integration-type AWS_PROXY \
        --integration-uri
cd ~/Desktop/"CamRide Super App"

cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

REGION="us-east-1"
FUNCTION_NAME="camride-backend"
ROLE_NAME="camrideLambdaRole"

echo "Creating IAM Role..."
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/dev/null || echo "")

if [ -z "$ROLE_ARN" ]; then
    aws iam create-role --role-name $ROLE_NAME \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "lambda.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }' > /dev/null
    
    aws iam attach-role-policy --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
    echo "Role created: $ROLE_ARN"
    sleep 10
else
    echo "Role exists: $ROLE_ARN"
fi

echo "Creating Lambda..."
cd backend
rm -rf lambda-deploy
mkdir -p lambda-deploy
cp -r src/* lambda-deploy/
cp package*.json lambda-deploy/
cd lambda-deploy
npm install --omit=dev
zip -r ../lambda.zip .
cd ..

aws lambda create-function \
    --function-name $FUNCTION_NAME \
    --runtime nodejs20.x \
    --role $ROLE_ARN \
    --handler server.handler \
    --zip-file fileb://lambda.zip \
    --timeout 30 \
    --region $REGION 2>/dev/null || \
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://lambda.zip \
    --region $REGION

cd ..

echo "Creating API Gateway..."
API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='camride-api'].ApiId" --output text)

if [ -z "$API_ID" ]; then
    API_ID=$(aws apigatewayv2 create-api \
        --name camride-api \
        --protocol-type HTTP \
        --query 'ApiId' \
        --output text)
fi

INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id $API_ID --query 'Items[0].IntegrationId' --output text 2>/dev/null || echo "")

if [ -z "$INTEGRATION_ID" ] || [ "$INTEGRATION_ID" == "None" ]; then
    INTEGRATION_ID=$(aws apigatewayv2 create-integration \
        --api-id $API_ID \
        --integration-type AWS_PROXY \
        --integration-uri arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:$FUNCTION_NAME \
        --payload-format-version 2.0 \
        --query 'IntegrationId' \
        --output text)
fi

aws apigatewayv2 create-route \
    --api-id $API_ID \
    --route-key 'POST /api/{proxy+}' \
    --target integrations/$INTEGRATION_ID 2>/dev/null || true

aws apigatewayv2 create-stage \
    --api-id $API_ID \
    --stage-name prod \
    --auto-deploy 2>/dev/null || true

aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id api \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" 2>/dev/null || true

API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"
echo "API created: $API_URL"

echo "Building frontend..."
cd camride-super-app/frontend
npm install
npm run build
cd ../..

echo "Deploying frontend to S3..."
BUCKET_NAME="camride-frontend-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME --region $REGION
aws s3 sync camride-super-app/frontend/dist/ s3://$BUCKET_NAME --delete
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET_NAME/*\"}]}"

echo ""
echo "DEPLOYMENT COMPLETE!"
echo "Frontend: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "Backend: $API_URL"
