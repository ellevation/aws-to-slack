//
// AWS VPN Connection Logs
//
exports.matches = event =>
	event.get("connection-log-type") === "connection-attempt";

exports.parse = event => {
	const connectionAttemptStatus = event.get("connection-attempt-status");
	const connectionAttemptFailureReason = event.get("connection-attempt-failure-reason");
	const connectionVpnEndpointId = event.get("client-vpn-endpoint-id");
	const connectionStartTime = new Date(event.get("connection-start-time"));
	const deviceIp = event.get("device-ip");
	var authorName;
	var title;
	const fields = [];

	var color = event.COLORS.neutral;

	fields.push({
		title: "Connection Status",
		value: `${connectionAttemptStatus}`,
		short: false
	});

	fields.push({
		title: "Failure Reason",
		value: `${connectionAttemptFailureReason}`,
		short: false
	});

	fields.push({
		title: "Time",
		value: `${connectionStartTime.toDateString()}`,
		short: false
	});

	fields.push({
		title: "Device IP",
		value: `${deviceIp}`,
		short: true
	});

	// Old cert-based VPN
	if (connectionVpnEndpointId === "cvpn-endpoint-0c65c1341739275b5") {
		title = `VPN Connection Attempt - ${deviceIp}`;
		authorName = "Certificate Prod VPN Connection";

		color = event.COLORS.warning;
	}
	// New SAML-based VPN
	else if (connectionVpnEndpointId === "cvpn-endpoint-0ba8b7b1c307b5186") {
		title = `VPN Connection Attempt - ${deviceIp}`;
		authorName = "SAML Prod VPN Connection";
		const username = event.get("username");

		fields.push({
			title: "Username",
			value: `${username}`,
			short: true
		});
	}

	return event.attachmentWithDefaults({
		author_name: authorName,
		fallback: `${title}`,
		color: color,
		title: title,
		fields: fields,
		mrkdwn_in: ["title", "text"]
	});
};