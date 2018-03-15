# aws-docx-replacer
A module that grabs variable names and replaces with values using DOCX files from Amazon S3.

You should be able to run the app by doing:
```bash
S3_BUCKET=bucket-name AWS_AKI=access_key AWS_SAK=secret_key AWS_REGION=aws_region ENDPOINT_HOST=www.asdf.com ENDPOINT_PATH=/ node app.js
```
