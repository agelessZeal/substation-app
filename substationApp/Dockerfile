#1.Building Stage ===========

# Create the image based on the official Node 10.13.0 image from Dockerhub
FROM node:10.13 as node

# Create a directory where our app will be placed. This might not be necessary
RUN mkdir -p /ng-substation-app

# Change directory so that our commands run inside this new directory
WORKDIR /ng-substation-app

# Copy dependency definitions
COPY package.json /ng-substation-app

# Install dependencies using npm
RUN npm install

# Additioanl Install dependencies for ng2-tree
COPY lib/tree.js /ng-substation-app/node_modules/ng2-tree/src

# Get all the code needed to run the app
COPY . /ng-substation-app

# Expose the port the app runs in
EXPOSE 4200


# start app
CMD ./node_modules/.bin/ng serve ssl --host 0.0.0.0
