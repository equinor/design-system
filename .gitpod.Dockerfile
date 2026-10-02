FROM gitpod/workspace-full:latest

USER gitpod
RUN bash -c 'VERSION="24.16.0" \
  && source $HOME/.nvm/nvm.sh && nvm install $VERSION \
  && nvm use $VERSION && nvm alias default $VERSION'
RUN brew install pnpm gitmoji
