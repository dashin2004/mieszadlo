<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template name="string-replace-all">
    <xsl:param name="text" />
    <xsl:param name="replace" />
    <xsl:param name="by" />
    <xsl:choose>
      <xsl:when test="contains($text, $replace)">
        <xsl:value-of select="substring-before($text,$replace)" />
        <xsl:value-of select="$by" />
        <xsl:call-template name="string-replace-all">
          <xsl:with-param name="text"
          select="substring-after($text,$replace)" />
          <xsl:with-param name="replace" select="$replace" />
          <xsl:with-param name="by" select="$by" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="string-replace">
    <xsl:param name="text" />
    <xsl:param name="replace" />
    <xsl:param name="by" />
    <xsl:choose>
      <xsl:when test="contains($text, $replace)">
        <xsl:value-of select="substring-before($text,$replace)" />
        <xsl:value-of select="$by" />
        <xsl:value-of select="substring-after($text,$replace)" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <!-- get object name from fully qualified name-->
  <xsl:template name="get-item-name">
    <xsl:param name="xsiType"></xsl:param>
    <xsl:choose>
      <xsl:when test="contains($xsiType,'.')">
        <xsl:call-template name="get-item-name">
          <xsl:with-param name="xsiType" select="substring-after($xsiType,'.')"></xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$xsiType"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="getTypeFilePath">
    <xsl:param name="widgetMetaPath"></xsl:param>
    <xsl:param name="itemName"></xsl:param>
    <xsl:param name="itemType"></xsl:param>
    <xsl:choose>
      <xsl:when test="$itemType='system'">
        <xsl:value-of select="concat($systemTypePath,$itemName,'.type')"/>
      </xsl:when>
      <xsl:when test="$itemType='structuredProperty'">
        <xsl:value-of select="concat($widgetMetaPath,$itemName,$elpathdelimiter,$itemName,'.type')"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="concat($widgetMetaPath,$itemName,'.widget')"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="get-list-length">
    <xsl:param name="value" />
    <xsl:variable name="listLength1">
      <xsl:call-template name="string-remove-brackets">
        <xsl:with-param name="text" select="$value" />
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="listLength">
      <xsl:call-template name="count-elements">
        <xsl:with-param name="count" select="0" />
        <xsl:with-param name="text" select="$listLength1" />
      </xsl:call-template>
    </xsl:variable>
    <xsl:value-of select="$listLength" />
  </xsl:template>
  <xsl:template name="string-remove-brackets">
    <xsl:param name="text" />
    <xsl:choose>
      <xsl:when test="contains($text, '(')">
        <xsl:variable name="replacedText">
          <xsl:value-of select="substring-before($text,'(')" />
          <xsl:value-of select="substring-after($text,')')" />
        </xsl:variable>
        <xsl:call-template name="string-remove-brackets">
          <xsl:with-param name="text" select="$replacedText" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="count-elements">
    <xsl:param name="count" />
    <xsl:param name="text" />
    <xsl:param name="separator" select="','" />
    <xsl:choose>
      <xsl:when test="contains($text, $separator)">
        <xsl:variable name="replacedText">
          <xsl:value-of select="substring-after($text, $separator)" />
        </xsl:variable>
        <xsl:call-template name="count-elements">
          <xsl:with-param name="count" select="$count+1" />
          <xsl:with-param name="text" select="$replacedText" />
          <xsl:with-param name="separator" select="$separator" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$count+1" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="trim">
    <xsl:param name="value"/>
    <xsl:choose>
      <xsl:when test="string-length($value)=0 or string-length(normalize-space($value))=0">
        <xsl:value-of select="$value"/>
      </xsl:when>
      <xsl:when test="starts-with($value,substring(normalize-space($value),1,1))">
        <xsl:choose>
          <xsl:when test="starts-with(substring($value,string-length($value)-1,1),substring(normalize-space($value),string-length(normalize-space($value))-1,1))">
            <xsl:value-of select="$value"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="trim">
              <xsl:with-param name="value" select="substring($value,1,string-length($value)-1)"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="trim">
          <xsl:with-param name="value" select="substring($value,2)"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="quote">
    <xsl:param name="value"/>
    <xsl:variable name="trimmedValue">
      <xsl:call-template name="trim">
        <xsl:with-param name="value" select="$value" />
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="contains($trimmedValue, ' ')">
        <xsl:text>"</xsl:text>
        <xsl:value-of select="$trimmedValue"/>
        <xsl:text>"</xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$trimmedValue"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="quote-font-names">
    <xsl:param name="text" />
    <xsl:choose>
      <xsl:when test="contains($text, ',')">
        <xsl:call-template name="quote">
          <xsl:with-param name="value" select="substring-before($text,',')" />
        </xsl:call-template>
        <xsl:text>, </xsl:text>
        <xsl:call-template name="quote-font-names">
          <xsl:with-param name="text" select="substring-after($text,',')" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="quote">
          <xsl:with-param name="value" select="$text" />
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>