# NUS Money Backend has changed

To start app locally, use `npm run start:dev`

GCP Cloud Run endpoint: https://nus-course-backend-5i7iu7m5xa-uc.a.run.app

---

CI/CD pipeline is setup via:

- Setting up of Cloud Build instance alongside with New Cloud Run (CI)

![CloudBuild](https://user-images.githubusercontent.com/78074686/206213474-a8bf8fd5-5a0c-4692-9ad9-a51e640ad280.png)

A new instance of Cloud Build will be created to build container image. 

![GitAuth](https://user-images.githubusercontent.com/78074686/206212838-125ba0cf-1295-4723-ba98-9244ab63d75f.png)

This will require Git credentials and whitelisting respective repository to deploy.

![CloudBuildTrigger](https://user-images.githubusercontent.com/78074686/206212921-b7f70784-1390-485b-8572-c6144b859b24.png)

Configure source (Repository & Branch) and event (Push) to listen to. 

---

- Deployment into Cloud Run (CD)
![CD](https://user-images.githubusercontent.com/78074686/206214305-f5bbafde-a338-46bc-823c-eaedcfd8c6da.PNG)

Once a new image is ready, it will be made available for deployment into Cloud Run instance.

Cloud Run will checks the existence of `Procfile` and run the scripts that supply after `web:`, in this case, `npm run start`. In order to run the application, you will also required to supply the secrets in Cloud Run configuration either using environment variables or referring to Secrets Manager. List of secrets to configure can be found in `.env_sample`.

---

For any push into main branch, a Whatsapp notification will be sent using Twilio sandbox number.

![Whatsapp](https://user-images.githubusercontent.com/78074686/206212997-37ac2d12-e8f8-4234-a33b-d1beb592545e.PNG)

