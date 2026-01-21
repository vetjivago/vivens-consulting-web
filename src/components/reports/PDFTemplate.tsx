import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";

// Register fonts if needed (optional for now, using standard fonts)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 30,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 10,
    },
    logo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2563EB", // Gemini-600 like color
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    section: {
        margin: 10,
        padding: 10,
    },
    label: {
        fontSize: 10,
        color: "#6B7280",
        marginBottom: 2,
    },
    value: {
        fontSize: 12,
        marginBottom: 8,
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
    },
    imageWrapper: {
        width: "48%",
        margin: "1%",
        height: 200,
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 4,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: "center",
        color: "#9CA3AF",
        fontSize: 10,
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
                <Text style={styles.logo}>VivensLab</Text>
                <View>
                    <Text style={{ fontSize: 10, color: "#6B7280" }}>Relatório Técnico</Text>
                    <Text style={{ fontSize: 10 }}>{data.date}</Text>
                </View>
            </View>

            {/* Info */}
            <View style={styles.section}>
                <Text style={styles.title}>{data.title}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View>
                        <Text style={styles.label}>Cliente</Text>
                        <Text style={styles.value}>{data.client}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Projeto</Text>
                        <Text style={styles.value}>{data.project}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Tipo</Text>
                        <Text style={styles.value}>{data.type}</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.label}>Descrição/Observações</Text>
                    <Text style={{ fontSize: 12, lineHeight: 1.5 }}>
                        {data.content}
                    </Text>
                </View>
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
