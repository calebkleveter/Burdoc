- [x] Downloading a document:

	- [x] This should include downloading in Markdown, HTML, and PDF format.

- [ ] Upgrade authentication:

	- [x] Use cookies and check header data against value stored on server or JWT.
	- [ ] Allow authentication with GitHub and Twitter.

- [ ] Collaborative editing:

	- [ ] Using Redis to hold the temporary data while editing so there can be live updates with Sockets, then save the data to the Postgres DB when the save button is activated.
	- [ ] Have custom updating ping times, i.e. every 1, 0.25, 0.1 seconds, etc. Default to 0.1 seconds?
	
	
- [ ] Tag Documents for sorting.

- [ ] Paid accounts:

	- [ ] Free account allows for 10 private documents.
	- [ ] Paid account allows infinity private documents and collaborative editing for documents.

- [ ] Have profiles:
	- [ ] User image
	- [ ] Public documents