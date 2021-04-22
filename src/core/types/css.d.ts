// https://github.com/mrmckeb/typescript-plugin-css-modules/tree/3199d8248d692e816a1d09714a558984628a3306#custom-definitions
declare module '*.css' {
  const classes: { [key: string]: string }
  export default classes
}
