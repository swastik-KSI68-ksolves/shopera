import { Text, StyleSheet, View } from 'react-native'

export const H1 = ({ children, style }) => {
    return (
        <View>
            <Text style={[styles.h1, style]}>
                {children}
            </Text>
        </View>
    )
}

export const H2 = ({ children, style }) => {
    return (
        <View>
            <Text style={[styles.h2, style]}>
                {children}
            </Text>
        </View>
    )
}

export const H3 = ({ children, style }) => {
    return (
        <View>
            <Text style={[styles.h3, style]}>
                {children}
            </Text>
        </View>
    )
}

export const H4 = ({ children, style }) => {
    return (
        <View>
            <Text style={[styles.h4, style]}>
                {children}
            </Text>
        </View>
    )
}

export const H5 = ({ children, style }) => {
    return (
        <View>
            <Text style={[styles.h5, style]}>
                {children}
            </Text>
        </View>
    )
}

export const H6 = ({ children, style }) => {
    return (
        <View>
            <Text style={[styles.h6, style]}>
                {children}
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    h1: {
        fontSize: 48,
    },
    h2: {
        fontSize: 42,
    },
    h3: {
        fontSize: 36,
    },
    h4: {
        fontSize: 30,
    },
    h5: {
        fontSize: 24,
    },
    h6: {
        fontSize: 18,
    },
})
