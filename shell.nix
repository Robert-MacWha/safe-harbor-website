{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  packages = with pkgs; [
    yarn-berry_4
    firebase-tools
  ];
}
