FROM node:10.0.0

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn install --pure-lockfile

# Bundle app source
COPY . .

# expose port 4000
EXPOSE 4000

CMD [ "yarn", "start" ]