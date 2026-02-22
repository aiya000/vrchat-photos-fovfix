import rawPackages from './oss-packages.json'

export interface OssPackage {
  name: string
  url: string
  licenseType: string
  licenseText: string
}

export const ossPackages: OssPackage[] = rawPackages
