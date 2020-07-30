import { CompilerOptions } from "../typescript.ts"
import { ts } from "../deps.ts"
import { red } from "https://deno.land/std/fmt/colors.ts"
import { Include, Exclude, plugin } from "../plugin.ts"

const defaultCompilerOptions = {
  target: "ESNext",
  module: "ESNext",
}

export function typescript(config: { include?: Include, exclude?: Exclude, options?: { compilerOptions: CompilerOptions } }) {

  const { include, exclude, options } = {
    include: (path: string) => /^https?:\/\//.test(path) || /\.(ts|js)$/.test(path),
    options: { compilerOptions: defaultCompilerOptions },
    ...config,
  }

  const transform = (source: string, path: string) => {
    const { diagnostics, outputText } = ts.transpileModule(source, { compilerOptions: ts.convertCompilerOptionsFromJson(options.compilerOptions).options, reportDiagnostics: true })
    if (diagnostics[0]) {
      console.error(red(`Error`), `could not transpile file: ${path}`)
      return
    }
    return outputText
  }

  return plugin({
    name: "typescript",
    include,
    exclude,
    transform
  })
}