import React from 'react';
import { Factura } from '../../redux/features/rtoSlice';
import {
    Document,
    Text,
    StyleSheet,
    Page,
    View
} from '@react-pdf/renderer';


interface PdfProps {
    factura: Factura,
    tarjeta: boolean
}

const styles = StyleSheet.create({
    page: {
        padding: '45px',
    },
    item: {
        margin: '10px',
    },
    table: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: '15px',
        marginHorizontal: '5px'
    },
    szSmall: {
        fontSize : '15px'
    },
    mgRight: {
        marginRight: '10px',
    }
})

const FacturaPDF: React.FC<PdfProps> = ({factura, tarjeta}) => {
    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.item}>Factura: {factura.nro_factura}</Text>
                <Text style={styles.item}>{factura.fecha_emision.toString()}</Text>
                <Text style={[styles.szSmall, styles.item]}>Conceptos:</Text>
                <View style={styles.item}>

                {
                    factura.lineas.map((item,index) => (
                        <View key={index} style={styles.table}>

                        
                            <Text style={styles.mgRight}>{item.descripcion}</Text>
                            <Text style={styles.mgRight}>${item.monto}</Text>
                        
                        </View>
                    ))
                }
                </View>
                
                <Text style={styles.item}>Total: ${factura.monto}</Text>
                {
                    tarjeta ? 
                    <Text style={styles.item}>Pagado con tarjeta</Text>
                    :
                    <Text style={styles.item}>Pagado</Text>
                }
                <Text style={styles.item}>Taller 9xpertos CUIT:11-111111-11</Text>
            </Page>
        </Document>
    )
    
};

export default FacturaPDF;