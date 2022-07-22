import gql from 'graphql-tag';
export const GET_COUNTRIES_QUERY = gql`
	{
		USCountries: countries(name: "United States of America") {
			edges {
				node {
					name
					nativeName
					currencies {
						edges {
							node {
								name
								code
								symbol
							}
						}
					}
					flag
				}
			}
		}
		europeCountries: countries(region: "Europe", name_Istartswith: "A") {
			edges {
				node {
					name
					nativeName
					currencies {
						edges {
							node {
								name
								code
								symbol
							}
						}
					}
					flag
				}
			}
		}
	}
`;
