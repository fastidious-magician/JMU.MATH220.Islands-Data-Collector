

module.exports = {

    getCSVString: (csv_records, csv_row_fields) => {

        let csv_str = "";

        let header_fields = csv_row_fields;

        let quote_char = '"';
        let sep_char = ",";
        let newline_char = "\n";
        let options = {
            quote_char: '"',
            sep_char: ",",
            newline_char: "\r\n"
        };

        for (let header_field in header_fields) {

            if (header_field == header_fields.length - 1) {
                csv_str += quote_char + header_fields[header_field] +
                    quote_char + newline_char;

            }
            else {
                csv_str += quote_char + header_fields[header_field] +
                    quote_char + sep_char;
            }

        }

        let double_quote_items = [];
        let changed_items = [];

        for (let row_index = 0; row_index < csv_records.length; row_index++) {

            for (let field in header_fields) {

                let current_row = csv_records[row_index];
                let current_field = header_fields[field];

                let curr_str = String(current_row[current_field]);
                let clean_str = "";

                // handle double quotes
                if (curr_str.indexOf('"') > -1) {

                    let in_quotes_regex = /"(.*?)"+/g;

                    if (curr_str.match(in_quotes_regex)) {
                        clean_str = curr_str.replace(/['"]+/g, '\'');
                    }
                    else {
                        clean_str = curr_str.replace(/['"]+/g, ' in. ');
                    }

                    double_quote_items.push(curr_str);
                    changed_items.push(clean_str);
                }
                else {
                    clean_str = curr_str;
                }

                // filter_state nulls
                if (clean_str == "null") {
                    clean_str = "";
                }

                // write
                if (field == header_fields.length - 1) {

                    // last column of row
                    csv_str += quote_char + clean_str +
                        quote_char + newline_char;
                }
                else {

                    // normal write
                    csv_str += quote_char + clean_str +
                        quote_char + sep_char;
                }
            }

        }

        return csv_str;
    }
};