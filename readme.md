# gcp-dataflow-trial
Trial to use provided template "Cloud Storage Text to BigQuery"  
https://cloud.google.com/dataflow/docs/guides/templates/provided-batch#gcstexttobigquery  
NOTE: You can't use JAPANESE page.

## Procedure
1. Access to Cloud Shell
1. Set project
    ```
    gcloud config set project [project-id]
    ```
1. Set environment variables
    ```
    export MY_DATASET=my-dataset
    export MY_TABLE=my-table
    ```
1. Make empty table  
NOTE: Using ingestion-time partitioned tables.
    ```
    bq --location=asia-northeast1 mk --dataset ${GOOGLE_CLOUD_PROJECT}:${MY_DATASET}
    bq mk -table --time_partitioning_type=DAY ${MY_DATASET}.${MY_TABLE}
    ```
1. Enable Dataflow api
    ```
    gcloud services enable dataflow.googleapis.com
    ```
1. Make bucket for dataflow
    ```
    gsutil mb -c standard -b on -l ASIA-NORTHEAST1 gs://${GOOGLE_CLOUD_PROJECT}-dataflow
    ```
1. Copy files to bucket
NOTE: Before this step, please copy each files to VM(Cloud Shell).
    ```
    gsutil cp index.js gs://${GOOGLE_CLOUD_PROJECT}-dataflow/index.js
    gsutil cp schema.json gs://${GOOGLE_CLOUD_PROJECT}-dataflow/schema.json
    gsutil cp data.txt gs://${GOOGLE_CLOUD_PROJECT}-dataflow/data.txt
    ```
1. Run dataflow
    ```
    gcloud dataflow jobs run job1 \
    --gcs-location gs://dataflow-templates-asia-northeast1/latest/GCS_Text_to_BigQuery \
    --region asia-northeast1 \
    --staging-location gs://${GOOGLE_CLOUD_PROJECT}-dataflow/staging \
    --parameters \
    JSONPath=gs://${GOOGLE_CLOUD_PROJECT}-dataflow/schema.json,\
    javascriptTextTransformGcsPath=gs://${GOOGLE_CLOUD_PROJECT}-dataflow/index.js,\
    javascriptTextTransformFunctionName=transform,\
    outputTable=${GOOGLE_CLOUD_PROJECT}:${MY_DATASET}.${MY_TABLE},\
    inputFilePattern=gs://${GOOGLE_CLOUD_PROJECT}-dataflow/data.csv,\
    bigQueryLoadingTemporaryDirectory=gs://${GOOGLE_CLOUD_PROJECT}-dataflow/temp
    ```
1. Check job status
    ```
    gcloud dataflow jobs list
    ```
---
1. Remove test table
    ```
    bq rm -t ${GOOGLE_CLOUD_PROJECT}:${MY_DATASET}.${MY_TABLE}
    ```
