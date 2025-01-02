# appart.ai-frontend

# Run locally with DOCKER:

1. Run the build command: (Compiles the Angular application into optimized static files that are placed in the dist directory to be used by Nginx)

    ng build --configuration production

2. build the docker image (we copy the files generated previously into a Nginx image to have a containerized env to run the app):

    docker build -t appart-ai-frontend .

3. Run the container (we run the app to make it accessible from localhost:420 and mapping the port 4200 to the port 80 in the container where Nginx serve the app):

    docker run -d -p 4200:80 --name appart-frontend appart-ai-frontend

