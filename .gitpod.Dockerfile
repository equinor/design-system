FROM gitpod/workspace-full:latest

USER gitpod
RUN bash -c 'VERSION="17" \
  && source $HOME/.nvm/nvm.sh && nvm install $VERSION \
  && nvm use $VERSION && nvm alias default $VERSION'
RUN brew install pnpm
RUN brew install gitmoji
RUN su node -c "gitmoji -i"
