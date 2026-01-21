import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { ReportBlock, StructuredReportData, ComplianceStatus } from "@/types/report";

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
    // Table Styles
    tableContainer: {
        marginTop: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#EFF6FF", // Blue-50
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        padding: 8,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
        padding: 8,
        alignItems: 'center',
    },
    colItem: { width: "10%" },
    colDesc: { width: "50%" },
    colClass: { width: "20%" },
    colStatus: { width: "20%" },

    tabletext: {
        fontSize: 10,
        color: "#374151",
    },
    headerTextTable: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#1E40AF", // Blue-800
    },

    // Status Badges
    statusBadge: {
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: "bold",
        textAlign: "center",
    },

    // Observation Block
    observationBlock: {
        marginBottom: 20,
        backgroundColor: "#F9FAFB",
        padding: 10,
        borderRadius: 4,
    },
    obsTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#DC2626", // Red-600 for critical/high
        marginBottom: 5,
    },
    obsImage: {
        width: "100%",
        height: 200,
        objectFit: "contain",
        marginTop: 10,
        borderRadius: 4,
    },

    // Executive Summary
    execSummary: {
        backgroundColor: "#F0FDF4", // Green-50
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#BBF7D0",
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

const StatusBadge = ({ status }: { status: ComplianceStatus }) => {
    let bg = "#F3F4F6";
    let color = "#374151";

    if (status === "Atende") { bg = "#DCFCE7"; color = "#166534"; }
    if (status === "Não Atende") { bg = "#FEE2E2"; color = "#991B1B"; }
    if (status === "Atende em Partes") { bg = "#FEF9C3"; color = "#854D0E"; }
    if (status === "Crítico") { bg = "#7F1D1D"; color = "#FFFFFF"; }

    return (
        <View style={[styles.statusBadge, { backgroundColor: bg }]}>
            <Text style={{ color: color }}>{status}</Text>
        </View>
    );
};

export const PDFTemplate = ({ data }: { data: StructuredReportData }) => (
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

            {/* Title & Info */}
            <Text style={styles.title}>{data.title}</Text>
            <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                    <Text style={styles.label}>Cliente</Text>
                    <Text style={styles.value}>{data.client}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.label}>Projeto</Text>
                    <Text style={styles.value}>{data.project}</Text>
                </View>
            </View>

            {/* Render Blocks */}
            {data.blocks && data.blocks.map((block, index) => {

                // 1. Executive Summary
                if (block.type === 'executive_summary') {
                    return (
                        <View key={block.id} style={styles.execSummary}>
                            <Text style={[styles.title, { fontSize: 16, marginBottom: 10 }]}>Resumo Executivo</Text>
                            <Text style={styles.value}>Imagens Analisadas: {block.data.imagesAnalyzed}</Text>
                            <Text style={styles.value}>Pontos Críticos: {block.data.criticalImages}</Text>
                            <Text style={[styles.value, { fontWeight: 'bold', marginTop: 5 }]}>Situação Geral: {block.data.generalStatus}</Text>
                        </View>
                    );
                }

                // 2. Compliance Table
                if (block.type === 'compliance_table') {
                    return (
                        <View key={block.id} break={index > 0}>
                            <Text style={[styles.title, { fontSize: 14, textAlign: 'left', marginTop: 10 }]}>{block.data.title}</Text>
                            <View style={styles.tableContainer}>
                                {/* Table Header */}
                                <View style={styles.tableHeader}>
                                    <View style={styles.colItem}><Text style={styles.headerTextTable}>Item</Text></View>
                                    <View style={styles.colDesc}><Text style={styles.headerTextTable}>Descrição (RN57)</Text></View>
                                    <View style={styles.colClass}><Text style={styles.headerTextTable}>Classificação</Text></View>
                                    <View style={styles.colStatus}><Text style={styles.headerTextTable}>Status</Text></View>
                                </View>
                                {/* Rows */}
                                {block.data.items?.map((item: any, i: number) => (
                                    <View key={i} style={styles.tableRow}>
                                        <View style={styles.colItem}><Text style={styles.tabletext}>{item.itemNumber}</Text></View>
                                        <View style={styles.colDesc}><Text style={styles.tabletext}>{item.description}</Text></View>
                                        <View style={styles.colClass}><Text style={styles.tabletext}>{item.classification}</Text></View>
                                        <View style={styles.colStatus}>
                                            <StatusBadge status={item.status} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                }

                // 3. Observation Block
                if (block.type === 'observation') {
                    return (
                        <View key={block.id} style={styles.observationBlock} break={false}>
                            <Text style={styles.obsTitle}>
                                {block.data.title ? block.data.title : "Observação"}
                            </Text>
                            <Text style={styles.contentSection}>{block.data.description}</Text>
                            {block.data.image && (
                                <Image src={block.data.image} style={styles.obsImage} />
                            )}
                        </View>
                    );
                }

                // 4. Text Section Block
                if (block.type === 'text_section') {
                    return (
                        <View key={block.id} style={styles.section} break={false}>
                            {block.data.title && (
                                <Text style={[styles.title, { fontSize: 14, textAlign: 'left', marginBottom: 10 }]}>
                                    {block.data.title}
                                </Text>
                            )}
                            <Text style={styles.contentSection}>
                                {block.data.text}
                            </Text>
                        </View>
                    );
                }

                return null;
            })}

            {/* Footer */}
            <Text style={styles.footer}>
                Vivens Consultoria - {data.project} - {data.client}
            </Text>
        </Page>
    </Document>
);
