type GithubProviderOptions = {
    sdk?: Record<string, any>;
    test?: boolean;
    testopts?: Record<string, any>;
};
declare function GithubProvider(this: any, options: GithubProviderOptions): {
    exports: {
        sdk: () => any;
    };
};
export default GithubProvider;
