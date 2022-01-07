function build_pattern(pattern_data: Record<string, string>) {
    return Object.entries(pattern_data)
    .map(([key,value], i) => [key, value].join(':'))
    .join(',')
}

export {
    build_pattern
}