import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";

// Register fonts if needed (optional for now, using standard fonts)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 40,
        fontFamily: "Helvetica",
        color: "#374151", // Gray-700
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: "#2563EB", // Gemini-600
        paddingBottom: 20,
    },
    logoImage: {
        width: 120,
        objectFit: "contain",
    },
    headerText: {
        textAlign: "right",
    },
    companyName: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#2563EB",
    },
    reportType: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827", // Gray-900
        marginTop: 4,
    },
    date: {
        fontSize: 10,
        color: "#6B7280",
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 20,
        textAlign: "center",
    },
    metaGrid: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6", // Gray-100
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
    },
    metaItem: {
        flex: 1,
    },
    label: {
        fontSize: 9,
        textTransform: "uppercase",
        color: "#6B7280",
        fontWeight: "bold",
        marginBottom: 4,
    },
    value: {
        fontSize: 11,
        color: "#1F2937",
        fontWeight: "medium",
    },
    contentSection: {
        marginTop: 10,
        lineHeight: 1.6,
        fontSize: 12,
        textAlign: "justify",
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 30,
        gap: 10,
    },
    imageWrapper: {
        width: "48%", // Two columns
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: 200,
        objectFit: "cover",
        borderRadius: 4,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        color: "#9CA3AF",
        fontSize: 9,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingTop: 10,
    },
});

type ReportData = {
    title: string;
    type: string;
    client: string; // Client Name
    project: string; // Project Title
    date: string;
    content: string; // Basic text content for now
    images: string[]; // Array of image URLs
};

export const PDFTemplate = ({ data }: { data: ReportData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Image src="/logo.jpg" style={styles.logoImage} />
                <View style={styles.headerText}>
                    <Text style={styles.companyName}>Vivens Consultoria Científica</Text>
                    <Text style={styles.reportType}>Relatório Técnico</Text>
                    <Text style={styles.date}>{data.date}</Text>
                </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{data.title}</Text>

            {/* Meta Info */}
            <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                    <Text style={styles.label}>Cliente</Text>
                    <Text style={styles.value}>{data.client}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.label}>Projeto</Text>
                    <Text style={styles.value}>{data.project}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.label}>Tipo</Text>
                    <Text style={styles.value}>{data.type}</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.section}>
                <Text style={styles.label}>Descrição e Observações</Text>
                <Text style={styles.contentSection}>
                    {data.content}
                </Text>
            </View>

            {/* Images Grid */}
            <View style={styles.imageContainer}>
                {data.images && data.images.map((img, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image src={img} style={styles.image} />
                    </View>
                ))}
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                Vivens Consultoria Científica - www.vivenslab.com
            </Text>
        </Page>
    </Document>
);
