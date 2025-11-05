{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs_20
    (pkgs.yarn.override { nodejs = null; })
    firebase-tools
  ];
}

