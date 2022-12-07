# NUS Money Backend

To start app locally, use `npm run start:dev`

GCP Cloud Run endpoint: https://nus-course-backend-5i7iu7m5xa-uc.a.run.app

CI/CD pipeline is setup via:

- Setting up of Cloud Build instance alongside with New Cloud Run (CI)
  A new instance of Cloud Build will be created to build container image. Configure source (Repository & Branch) and event (Push) to listen to. This will require Git credentials and whitelisting respective repository to deploy.

- Deployment into Cloud Run (CD)
  Once a new image is ready, it will be made available for deployment into Cloud Run instance.

Cloud Run will checks the existence of `Procfile` and run the scripts that supply after `web:`, in this case, `npm run start`. In order to run the application, you will also required to safely store the secrets in Cloud Run configuration either using environment variables or referring to Secrets Manager. List of secrets to configure can be found in `.env_sample`.

For any push into main branch, a Whatsapp notification will be sent using Twilio sandbox number.
