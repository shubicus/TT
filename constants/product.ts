export enum Addons {
    MONTHLY_CLOUD_LINUX = 'Monthly CloudLinux',
    //etc...
}

export enum CPanelLicenses {
    ACCOUNT_1 = 'cPanel Solo® Cloud (1 Account)',
    ACCOUNT_5 = 'cPanel Admin Cloud (5 Accounts)',
    ACCOUNT_30 = 'cPanel Pro Cloud (30 Accounts)',
    ACCOUNT_100 = 'cPanel Premier (100 Accounts)',
    WP = 'WP Squared',
    NONE = 'NONE'
}

export type EProduct = CPanelLicenses | Addons;

export type TProduct = {
    title: EProduct,
    ipAddress?: string,
    dueTodayPrice: number;
    recurringPrice: number;
}