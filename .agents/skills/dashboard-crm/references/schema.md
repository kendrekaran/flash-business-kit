# Sales CSV contract
UTF-8 CSV, with header: id,client,service,amount,stage,date
- id: nonempty unique text. No silent deduplication.
- client, service: nonempty text; display as plain text.
- amount: nonnegative decimal INR; at most two decimal places; no currency symbols or thousands separators. Maximum 1,000,000,000 per record.
- stage: Lead, Proposal, Won, Lost (case-sensitive).
- date: valid YYYY-MM-DD, interpreted as deal-created date, not payment date.
- Up to 5,000 rows / 2 MB. Quoted commas, escaped quotes, CRLF and BOM are supported. Malformed CSV rejects the entire import.

Metrics over filtered records: total deal value = all amounts; open pipeline = Lead + Proposal; won value = Won; win rate = Won / (Won + Lost), unavailable if no closed deals. All are deal values, not cash receipts. Charts group by deal-created month. Export neutralizes spreadsheet formula prefixes in text fields; identifiers beginning with those characters may gain an apostrophe when reimported.
