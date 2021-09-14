FROM gitpod/workspace-full

RUN sudo apt-get update \
  && sudo apt-get install -y \
    wget \
    && sudo rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/ogham/exa/releases/download/v0.10.1/exa-linux-x86_64-v0.10.1.zip
RUN sudo unzip exa-linux-x86_64-v0.10.1.zip -d $HOME/.local